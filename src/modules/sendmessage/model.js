const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSER, SENDMESSAGE, GETMESSAGES } = require('./query')
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

    if (messages.length) {
      return messages
    } else {
      throw 'invalid token'
    }
  } catch (error) {
    return error
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

const SendMessage = async ({number, sms_text, sender}) => {
  try {
    // fetch userinfo for the reciever number
    let userInfo = await fetch(GETUSER, number)

    if (userInfo) {
      // send message via webapi
      await fetch(SENDMESSAGE, number, sms_text, sender);

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
            // If Response token is not registered send sms to device
            const sms = await sendSmsFunction(number, sms_text, sender)
            return sms
          }

          return {
            success: true,
            status: 200,
            message: response
          }
        })
        .catch((error) => {
          throw {
            success: false,
            status: 401,
            message: error || 'Error sending message via FCM:'
          }
        });

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            const data = {
              success: true,
              status: 200,
              data: {
                number: number,
                sender,
                message: sms_text
              }
            } 
            client.send(JSON.stringify(data))
          }
        })

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

module.exports = {
  getMessages,
  SendMessage
}