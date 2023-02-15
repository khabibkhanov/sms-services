const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSER, SENDMESSAGE, GETMESSAGES, DELETEMESSAGE } = require('./query')
const { SendSms } = require('../../lib/send')
const { verify } = require('../../lib/jwt')
const WebSocket = require('ws')
const { firebaseAdmin } = require('../../config')
const wss = new WebSocket(process.env.WSHOST)
console.log(process.env.WSHOST);
const getMessages = async (token) => {
  try {
    // Verify the token
    const user_number = verify(token);

    // Get all messages for the user
    let messages = await fetchAll(GETMESSAGES, user_number);

    if (messages) {
      // Create an object to store the messages grouped by sender
      const groupedMessages = {};

      // Iterate over the messages and group them by sender
      for (let i = 0; i < messages.length; i++) {
        const { sms_id, sender, sms_text, sms_created_at } = messages[i];

        if (!groupedMessages[sender]) {
          groupedMessages[sender] = [];
        }
        groupedMessages[sender].push({
          sms_id,
          sms_text,
          sms_created_at
        });
      }

      // Convert the object to an array of objects, each with a "sender" key and a "messages" key
      const groupedMessagesArray = Object.keys(groupedMessages).map(sender => ({
        sender,
        messages: groupedMessages[sender]
      }));

      // Return the grouped messages
      return {
        status: 200,
        success: true,
        data: groupedMessagesArray
      };
    } else {
      throw 'Invalid Token';
    }
  } catch (error) {
    return {
      status: 400,
      success: false,
      data: error
    };
  }
};

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
      const sendApplication = await firebaseAdmin.messaging().sendToDevice(userInfo.fcm_token, message)
        .then(async (response) => { 

          if(response?.results[0].error) {
            fcmIsWorking = true
            // If Response token is not registered send sms to device
            const sms = await SendSms(number, sms_text, sender)
            return sms
          }

          // send message via webapi
          sms_id = await fetch(SENDMESSAGE, number, sms_text, sender);

          if (sms_id.sms_id) {
            return {
              success: true,
              status: 200,
              data: {  sender,
                number,
                message_id: sms_id.sms_id,
                sms_text,
              },
              message: 'message successfully sent via application'
            }
          } else {
            // If Response token is not registered send sms to device
            const sms = await SendSms(number, sms_text, sender)
            return sms
          }
        })
        .catch((error) => {
          throw {
            success: false,
            status: 401,
            data: {},
            message: error || 'Error sending message via FCM:'
          }
        });

        if (fcmIsWorking === false) {

          console.log(wss.clients);
          for (const client of wss.clients) {
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
              };
              client.send(JSON.stringify(data));
            } else {
              console.log('client.readyState, WebSocket.OPEN');
            }
          }
        }
        // console.log(sendApplication);
        return sendApplication
    } else {
      // if token or userInfo not present send via SMS
      const sms = await SendSms(number, sms_text, sender)
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
        message: isDeleted.case,
        data: {}
      }
    } else {
      throw {
        status: 404,
        success: false,
        data: {},
        message: 'Message does not exist',
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