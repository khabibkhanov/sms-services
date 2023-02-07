const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSER, SENDMESSAGE, GETMESSAGES, DELETEMESSAGE } = require('./query')
const { SendSms } = require('../../lib/send')
const { verify } = require('../../lib/jwt')
const admin = require('firebase-admin');
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

admin.initializeApp({
  credential: admin.credential.cert(require('../../services/programmsoft-sms-service.json')),
  databaseURL: 'https://smsservices-e6622.firebaseio.com'
});

const getMessages = async (token) => {
  try {
    const user_number= verify(token)

    let messages = await fetchAll(GETMESSAGES, user_number)

    if (messages) {
      return {
        status: 200,
        success: true,
        data: messages
      }
    } else {
      throw  'Invalid Token'
    }
  } catch (error) {
    return {
      status: 400,
      success: false,
      data: error
  }
  }
}

const sendSmsFunction = async (number, sms_text, sender) => {
  await SendSms(number, sms_text)

  return {
    success: true,
    status: 200,
    data: {
      sender,
      number,
      sms_text 
    },
    message: 'Successfully sent message via SMS'
  }
}

const sendMessage = async ({number, sms_text, sender}) => {
  try {
    // fetch userinfo for the reciever number
    let userInfo = await fetch(GETUSER, number)
    let fcmIsWorking = false
    let sms_id = 0

    if (userInfo) {
      const message = {
        notification: {
          title: sender,
          body: sms_text
        },
        data: {
          sender,
          number,
          sms_text,
        }
      }

      // notify the clients connected via FCM
      const sendApplication = await admin.messaging().sendToDevice(userInfo.fcm_token, message)
        .then(async (response) => { 

          if(response?.results[0].error) {
            fcmIsWorking = true
            // If Response token is not registered send sms to device
            const sms = await sendSmsFunction(number, sms_text, sender)
            return sms
          }

          // send message via webapi
          sms_id = await fetch(SENDMESSAGE, number, sms_text, sender);

          if (sms_id) {
            return {
              success: true,
              status: 200,
              message: {
                sender,
                number,
                message_id: sms_id.sms_id,
                sms_text,
              }
            }
          }
        })
        .catch((error) => {
          throw {
            success: false,
            status: 401,
            message: error || 'Error sending message via FCM:'
          }
        });
  
        if (!fcmIsWorking) {
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              const data = {
                success: true,
                status: 200,
                data: {
                  sender,
                  number,
                  message_id: sms_id?.sms_id,
                  message: sms_text
                }
              }
              client.send(JSON.stringify(data))
            }
          })
        }
        return sendApplication
    } else {
      // if token or userInfo not present send via SMS
      const sms = await sendSmsFunction(number, sms_text, sender)
      return sms
    }

  } catch (error) {
      return error
  }
}

const deleteMessage = async (message_id, number) => {
  try {
    const user_number= verify(number)
    sms_id = parseInt(message_id)
    const isDeleted = await fetch(DELETEMESSAGE, sms_id, user_number)

    if (isDeleted) {
      return {
        status: 200,
        success: true,
        data: isDeleted.case
      }
    } else {
      throw {
        status: 404,
        success: false,
        data: 'Message does not exist',
      }
    }
  } catch (error) {
    return error
  }
}

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
}