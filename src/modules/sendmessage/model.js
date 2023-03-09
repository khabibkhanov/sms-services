const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSER, SENDMESSAGE, GETMESSAGES, DELETEMESSAGE } = require('./query')
const { SendSms } = require('../../lib/send')
const { verify } = require('../../lib/jwt')
const { firebaseAdmin } = require('../../config')

// Define a function to get all messages for a given user
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
          // If this is the first message from this sender, create an array to store the messages
          groupedMessages[sender] = [];
        }
        // Add the message to the array for the sender
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
      // If no messages were found for the user, return an error message
      throw 'Invalid Token';
    }
  } catch (error) {
    // If there was an error, return an error message
    return {
      status: 400,
      success: false,
      data: error
    };
  }
};

// This function sends a message to the specified number, using FCM if possible
// If FCM is not available or fails, it falls back to sending an SMS
const sendMessage = async ({number, sms_text, sender}, wss) => {
  try {
    // Fetch the user info for the receiver number
    let userInfo = await fetch(GETUSER, number)
    let fcmIsWorking = false
    let sms_id = 0

    // If the user info was found, attempt to send the message via FCM
    if (userInfo) {
      // Set up the message object for FCM
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

      // Send the message via FCM
      const sendApplication = await firebaseAdmin.messaging().sendToDevice(userInfo.fcm_token, message)
        .then(async (response) => { 

          // If the FCM response contains an error, FCM is not working or the token is not registered
          if(response?.results[0].error) {
            fcmIsWorking = true
            // Fall back to sending an SMS
            const sms = await SendSms(number, sms_text, sender)
            return sms
          }

          // If the message was sent successfully via FCM, record it in the database
          sms_id = await fetch(SENDMESSAGE, number, sms_text, sender);

          if (sms_id.sms_id) {
            // Return a success response
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
            // Fall back to sending an SMS
            const sms = await SendSms(number, sms_text, sender)
            return sms
          }
        })
        .catch((error) => {
          // If there was an error with FCM, throw an error response
          throw {
            success: false,
            status: 401,
            data: {},
            message: error || 'Error sending message via FCM:'
          }
        });

        // If FCM was not working, broadcast the message via WebSocket
        if (fcmIsWorking === false) {

          for (const client of wss.wss.clients) {
            if (client.readyState === wss.ReconnectingWebSocket.OPEN) {
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
        console.log(sendApplication)
        return sendApplication
    } else {
      // If user info is not present, fall back to sending an SMS
      const sms = await SendSms(number, sms_text, sender)
      console.log(sms)
      return sms
    }

  } catch (error) {
      console.log(error);
      return error
  }
}

// This function deletes a message from the database
const deleteMessage = async (message_id, number) => {
  try {
    // Verify the token
    const user_number= verify(number)
    // Parse the message ID into an integer
    sms_id = parseInt(message_id)
    // Delete the message from the database
    const isDeleted = await fetch(DELETEMESSAGE, sms_id, user_number)

    // If the message is successfully deleted from the database, return a success response
    if (isDeleted) {
      return {
        status: 200,
        success: true,
        message: isDeleted.case,
        data: {}
      }
    } else {
      // If the message does not exist, throw a 404 error
      throw {
        status: 404,
        success: false,
        data: {},
        message: 'Message does not exist',
      }
    } 
  } catch (error) {
  // If an error occurs, return the error
    return error
  }
}
      
// Export the functions for use in other parts of the application
module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
}