const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSERNUMBER, SENDMESSAGE, GETMESSAGES } = require('./query')
const { SendSms } = require('../../lib/send')
const WebSocket = require('ws')
const { verify } = require('../../lib/jwt')

const wss = new WebSocket.Server({ port: 8080 })

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

const SendMessage = async ({reciever_number, sms_text}, token) => {
  try {
    // check if the reciever number is a number 
    if (isNaN(reciever_number)) {
			throw 'User number must be a number'
		}

    // check if the reciever number is in valid format
    if (reciever_number.length != 12) {
      throw {
          status: 400,
          message: 'Invalid phone number format'
      }
    }

    // fetch userinfo for the reciever number
    let userInfo = await fetch(GETUSERNUMBER, reciever_number)

    if (token && userInfo) {
 
        // send message via webapi
        await fetch(SENDMESSAGE, reciever_number, sms_text);

        // notify the clients connected via websocket
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            const data = {
              success: true,
              status: 200,
              data: {
                number: reciever_number,
                message: sms_text
              }
            }
            client.send(JSON.stringify(data))
          }
        })

        return {
            success: true,
            status: 200,
            message: 'Successfully sent message via API and WebSocket'
        }
    } else {

      // if token or userInfo not present send via SMS
      await SendSms(reciever_number, sms_text)

      return {
        success: true,
        status: 200,
        data: {
          number: reciever_number,
          message: sms_text,
        },
        message: 'Successfully sent message via SMS'
      }
    }
  } catch (error) {
      return error
  }
}

module.exports = {
  getMessages,
  SendMessage
}