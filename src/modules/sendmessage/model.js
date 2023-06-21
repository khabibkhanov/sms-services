const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSER, SENDMESSAGE, GETMESSAGES, DELETEMESSAGE, GETTOTALMESSAGES } = require('./query')
const { SendSms } = require('../../lib/send')
const { firebaseAdmin } = require('../../config')

const getMessages = async (userNumber, page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const messages = await fetchAll(GETMESSAGES, userNumber, limit, offset);
    const totalMessages = await fetch(GETTOTALMESSAGES, userNumber);

    if (messages && messages.length > 0) {
      const groupedMessages = {};

      messages.forEach((message) => {
        const { sender, ...messageData } = message;

        if (!groupedMessages[sender]) {
          groupedMessages[sender] = [];
        }

        groupedMessages[sender].push(messageData);
      });

      const groupedMessagesArray = Object.entries(groupedMessages).map(([sender, messages]) => ({
        sender,
        messages,
      }));

      return {
        status: 200,
        success: true,
        data: groupedMessagesArray,
        totalMessages: totalMessages.total_count,
      };
    } else {
      throw new Error('No messages found');
    }
  } catch (error) {
    return {
      status: 400,
      success: false,
      message: error.message || 'Error retrieving messages',
    };
  }
};

const sendMessage = async ({ number, sms_text, sender }, wss) => {
  try {
    const userInfo = await fetch(GETUSER, number);

    if (userInfo) {
      const message = {
        notification: {
          title: sender,
          body: sms_text,
        },
        data: {
          sender,
          number,
          sms_text,
        },
      };

      const response = await firebaseAdmin.messaging().sendToDevice(userInfo.fcm_token, message);

      if (response?.results[0]?.error) {
        throw new Error('FCM is not working or the token is not registered: ' + response.results[0].error);
      }

      const sms_id = await fetch(SENDMESSAGE, number, sms_text, sender);

      const data = {
        success: true,
        status: 200,
        data: {
          sender,
          number,
          message_id: sms_id?.sms_id,
          message: sms_text,
        },
      };

      for (const client of wss.wss.clients) {
        if (client.readyState) {
          client.send(JSON.stringify(data));
        } else {
          throw new Error(`Error while connecting to the websocket: ${number}`);
        }
      }

      if (sms_id?.sms_id) {
        return sms_id;
      } else {
        throw new Error('Error while sending message or recording it to the database: ' + sms_id);
      }
    } else {
      throw new Error('User does not exist');
    }
  } catch (error) {
    return {
      success: false,
      status: 401,
      data: {},
      error: error.message || 'Error sending message via FCM',
    };
  }
};


// This function deletes a message from the database
const deleteOneMessage = async (message_id, user_number) => {
    try {
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

const deleteMessageBySender = async (sender, user_number) => {
  try {
      // Delete the message from the database
      const isDeleted = await fetch(DELETEMESSAGE, sender, user_number)
    
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
    deleteOneMessage,
    deleteMessageBySender
}