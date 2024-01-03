//zdrojak pro získávání zpráv z HarperDb
//dá se najít přímo v examplech harperu - takže se db funkce programují o dost jednodušeji
//s dobrým tutorialem to šlo zporovoznit

let axios = require('axios');

async function harperGetMessages(room) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  let data = JSON.stringify({
    operation: 'sql',
    sql: `SELECT * FROM realtime_chat_app.messages WHERE room = '${room}' LIMIT 100`,
  });

  let config = {
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

  /*try {
    const response = await axios(config);
    return JSON.stringify(response.data);
  } catch (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }*/
}

module.exports = harperGetMessages;