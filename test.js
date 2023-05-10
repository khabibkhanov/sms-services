const axios = require('axios');

const numbers = [
  { number: '998909340450', sender: 'test2', sms_text: 'code: 123' },
  { number: '998913574568', sender: 'test2', sms_text: 'code: 5456' },
  { number: '998911552624', sender: 'test2', sms_text: 'code: 123' },
  { number: '998909098828', sender: 'test2', sms_text: 'code: 123' },
  { number: '998900319921', sender: 'test2', sms_text: 'code: 123' },
  { number: '998996842882', sender: 'test2', sms_text: 'code: 123' },
  { number: '998901672133', sender: 'test2', sms_text: 'code: 123' },
];

const url = 'http://sms-service.gamespot.uz:35000/api/sendmessage';
const headers = {
  'Content-Type': 'application/json',
};

// Function to send a message to a single number
async function sendMessage(number, sender, sms_text) {
  const payload = { number, sender, sms_text };
  try {
    const response = await axios.post(url, payload, { headers });
    if (response.data.sms_id) {
        console.log(`Message sent to ${number}, ${response.data.sms_id}` );
    } else (
        console.log(`Message can't sent to ${number}, because ${response.data}`)
    )
  } catch (error) {
    console.error(`Failed to send message to ${number}`);
  }
}

// Send messages to all numbers in the array
numbers.forEach(({ number, sender, sms_text }) => {
  sendMessage(number, sender, sms_text);
});
