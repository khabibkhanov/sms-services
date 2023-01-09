const { fetch } = require('../../lib/postgres')
const { GETUSERNUMBER, SENDMESSAGE } = require('./query')
const { SendSms } = require('../../lib/send')

const SendMessage = async ({reciever_number, sms_text, isOnline}) => {
  try {
    if (isNaN(reciever_number)) {
			throw 'User number must be a number'
		}

    let userInfo = await fetch(GETUSERNUMBER, reciever_number)

    if (isOnline && userInfo) {
        await fetch(SENDMESSAGE, reciever_number, sms_text)

        return {
          success: true,
          status: 200,
          fromApplication: true,
          data: {
            number: reciever_number,
            message: sms_text,
          }
        }
    } else {
      const send = await SendSms(reciever_number, sms_text)
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