const color = require('ansi-colors');

const log = (message, type = 0) => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  let typeMessage;
  let colorize;

  switch (type) {
    case 0: 
      typeMessage = 'INFO';
      colorize = color.yellow;
      break;
    case 1:
      typeMessage = 'OK';
      colorize = color.green;
      break;
    case 2:
      typeMessage = 'ALERT';
      colorize = color.magenta;
      break;
    case 3: 
      typeMessage = 'ERROR';
      colorize = color.red;
      break;
    default:
      typeMessage = 'UNKNOWN';
      colorize = color.gray;
      break;
  }

  const paddedType = typeMessage.padEnd(7, ' ');

  // 메시지가 객체인 경우 JSON 문자열로 변환
  let messageStr;
  if (typeof message === 'object') {
    try {
      messageStr = JSON.stringify(message, null, 2); // 보기 좋게 포맷팅
    } catch (err) {
      messageStr = '[Unserializable Object]';
    }
  } else {
    messageStr = String(message);
  }

  const lines = messageStr.split('\n');
  let formattedMessage = `[ ${colorize(paddedType)} | ${hour}:${minute}:${second} ] | ${lines[0]}`;

  for (let i = 1; i < lines.length; i++) {
    formattedMessage += `\n                       | ${lines[i]}`;
  }

  console.log(formattedMessage);
};

module.exports = log;
