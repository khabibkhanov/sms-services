const { fetch } = require('../../lib/postgres')
const { GETUSERNUMBER, SENDMESSAGE } = require('./query')
const { SendSms } = require('../../lib/send')
const WebSocket = require('ws')
const { verify } = require('../../lib/jwt')

const wss = new WebSocket.Server({ port: 8080 })

const SendMessage = async ({reciever_number, sms_text}, token) => {
  try {

    if (isNaN(reciever_number)) {
			throw 'User number must be a number'
		}

    if (reciever_number.length != 12) {
      throw {
          status: 400,
          message: 'Invalid phone number'
      }
  }

    let userInfo = await fetch(GETUSERNUMBER, reciever_number)

    if (token && userInfo) {
        await fetch(SENDMESSAGE, reciever_number, sms_text)

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            const data = {
              success: true,
              status: 200,
              fromApplication: false,
              data: {
                number: reciever_number,
                message: sms_text
              }
            } 
            client.send(JSON.stringify(data))
          }
        })

        return 'successfully sent message'
    } else {
      const send = await SendSms(reciever_number, sms_text)

      if (!send) {
        throw {
          status: 400,
          message: 'Invalid code'
        }
      }

      return {
        success: true,
        status: send.status,
        fromApplication: false,
        data: {
          number: reciever_number,
          message: sms_text,
        }
      }
    }
  } catch (error) {
      return error
  }
}

module.exports = {
  SendMessage
}