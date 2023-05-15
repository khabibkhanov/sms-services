const { fetch, fetchAll } = require('../../lib/postgres')
const { GETUSER, SENDMESSAGE, GETMESSAGES, DELETEMESSAGE, GETTOTALMESSAGES } = require('./query')
const { SendSms } = require('../../lib/send')
const { firebaseAdmin } = require('../../config')

const getMessages = async (userNumber, page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const messages = await fetchAll(GETMESSAGES, userNumber, limit, offset);
    const [{ total_count: totalMessages }] = await fetch(GETTOTALMESSAGES, userNumber);

    if (messages.length > 0) {
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
        totalMessages: totalMessages,
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
                    throw 'FCM is not working or the token is not registered: ' + response.results[0].error
                }

                // If the message was sent successfully via FCM, record it in the database
                sms_id = await fetch(SENDMESSAGE, number, sms_text, sender);
             
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
            
                for (const client of wss.wss.clients) {
                    if (client.readyState) {
                      client.send(JSON.stringify(data));
                    } else {
                      throw `Error while connect to websocket: ${number}`
                    }
                }
            
                if (sms_id.sms_id) {
                    // Return a success response
                    return sms_id
                } else {
                    // Fall back to sending an SMS
                    throw 'Error while sending message or recording it to database: ' + sms_id
                }
            })
            .catch((error) => {
                // If there was an error with FCM, throw an error response
                throw error
            });
            
            return sendApplication
        } else {
            // If user info is not present, fall back to sending an SMS
            return 'user doesnt exist '
        }
    } catch (error) {
        return {
            success: false,
            status: 401,
            data: {},
            error: error || 'Error sending message via FCM'
        }
    }
}

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
      
// Export the functions for use in other parts of the application
module.exports = {
    getMessages,
    sendMessage,
    deleteOneMessage,
}