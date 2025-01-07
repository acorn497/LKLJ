const color = require('ansi-colors');

let smoothPrint = true;
let isProcessing = false;
const messageQueue = [];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processQueue = async () => {
  if (isProcessing || messageQueue.length === 0) return;
  
  isProcessing = true;
  const { message, type, timestamp } = messageQueue.shift();
  
  await printMessage(message, type, timestamp);
  
  isProcessing = false;
  processQueue();
};

const printMessage = async (message, type, timestamp) => {
  const time = new Date(timestamp);
  const hour = String(time.getHours()).padStart(2, '0');
  const minute = String(time.getMinutes()).padStart(2, '0');
  const second = String(time.getSeconds()).padStart(2, '0');

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
  const prefix = `[ ${colorize(paddedType)} | ${hour}:${minute}:${second} ] | `;

  let messageStr;
  if (typeof message === 'object') {
    try {
      messageStr = JSON.stringify(message, null, 2);
    } catch (err) {
      messageStr = '[Unserializable Object]';
    }
  } else {
    messageStr = String(message);
  }

  const lines = messageStr.split('\n');

  if (smoothPrint && lines.length === 1 && lines[0].length > 0) {
    process.stdout.write('\r' + prefix);
    
    const intervalTime = 20;
    
    for (let i = 1; i <= lines[0].length; i++) {
      const partialText = lines[0].slice(0, i);
      process.stdout.write('\r' + prefix + partialText);
      await sleep(intervalTime);
    }
    console.log();
  } else {
    let formattedMessage = prefix + lines[0];
    for (let i = 1; i < lines.length; i++) {
      formattedMessage += '\n' + ' '.repeat(23) + '| ' + lines[i];
    }
    console.log(formattedMessage);
  }
};

const log = async (message, type = 0) => {
  messageQueue.push({ 
    message, 
    type,
    timestamp: Date.now()
  });
  processQueue();
};

module.exports = log;