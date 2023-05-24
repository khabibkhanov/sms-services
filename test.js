const axios = require('axios');

const url = 'http://sms-service.gamespot.uz:35000/api/sendmessage';
const numbers = [
  '99891354568',
  '99891152624'
];

async function sendRequests() {
  try {
    const codes = Array.from({ length: 1 }, () => (Math.floor(Math.random() * 9000) + 1000).toString().substring(0, 4));

    const senders = Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000));

    const responses = await Promise.all(
      senders.flatMap(sender =>
        numbers.flatMap(number =>
          codes.map(code => {
            const requestBody = {
              number: number,
              sender: 'sender-' + sender.toString(),
              sms_text: `your code is: 300`
            };

            return axios.post(url, requestBody, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
          })
        )
      )
    );

    responses.forEach((response, index) => {
      const isSuccess = response.status === 200;
      if (response.data.error) {
        console.log(response.data.error);
      }
      console.log(response.data);
      console.log(`Request ${index + 1}: ${isSuccess ? 'Success' : 'Failure'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

sendRequests();