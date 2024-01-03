//zdrojak pro odesílání zpráv na HarperDb a uložení
//dá se najít přímo v examplech harperu - takže se db funkce programují o dost jednodušeji
//s dobrým tutorialem to šlo zporovoznit


var axios = require('axios');

function harperSaveMessage(message, username, room) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  //if (!dbUrl || !dbPw) return null;

  if (!dbUrl || !dbPw) {
    return Promise.reject(new Error('HarperDB URL or password not provided'));
  }

  var data = JSON.stringify({
    operation: 'insert',
    schema: 'realtime_chat_app',
    table: 'messages',
    records: [
      {
        message,
        username,
        room,
      },
    ],
  });

  var config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: dbPw,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = harperSaveMessage;