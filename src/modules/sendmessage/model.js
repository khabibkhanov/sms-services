const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSERNUMBER, SENDMESSAGE, GETMESSAGES } = require('./query')
const { SendSms } = require('../../lib/send')
const { verify } = require('../../lib/jwt')
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('../../services/programmsoft-sms-service.json')),
  databaseURL: 'https://smsservices-e6622.firebaseio.com'
});

const getMessages = async (token) => {
  try {
    const { user_number } = verify(token)

    let user = await fetchAll(GETMESSAGES, user_number)
  
    if (user.length) {
      return user    
    } else {
      throw 'invalid token'
    }
  } catch (error) {
    return error
  }
}

const sendSmsFunction = async (number, sms_text) => {
  await SendSms(number, sms_text)
  return {
    success: true,
    status: 200,
    data: {
      number: number, 
    },
    message: 'Successfully sent message via SMS'
  }
}

const SendMessage = async ({number, sms_text}, Regstration_Token) => {
  try {
    // fetch userinfo for the reciever number
    let userInfo = await fetch(GETUSERNUMBER, number)

    if (userInfo && Regstration_Token) {
      // send message via webapi
      await fetch(SENDMESSAGE, number, sms_text);

      const message = {
        notification: {
          title: "New message received",
          body: sms_text
        },
        data: {
          number: number,
          sms_text: sms_text,
        }
      }

      // notify the clients connected via FCM
      const sendApplication = await admin.messaging().sendToDevice(Regstration_Token, message)
        .then(async (response) => { 
          if(response?.results[0].error) {
            // If Response token is not registered send sms to device
            const sms = await sendSmsFunction(number, sms_text)
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

        return sendApplication
    } else {
      // if token or userInfo not present send via SMS
      const sms = await sendSmsFunction(number, sms_text)
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