require('dotenv').config()

const express = require('express');
const multer = require('multer');
const path = require('path');
const FormData = require('form-data');
const https = require('https');
const app = express();
const uploadDir = 'uploads/';
const chatId = process.env.CHAT_ID;
const botToken = process.env.BOT_TOKEN;
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 52428800 }
});

app.use(express.json());

app.post('/', upload.single('file'), (req, res) => {
  const form = new FormData();
  
  if (req.file) {
    console.log(`Received file: ${req.file.originalname}`);
    form.append('document', req.file.buffer, { filename: req.file.originalname });
  }

  if (req.body.text) {
    console.log(`Received text: ${req.body.text}`);
    form.append('caption', req.body.text);
  }

  if (!req.file && req.body.text) {
    const reqHttps = https.request(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${req.body.text}`);
  reqHttps.on('error', (err) => {
    console.error(err);
  });
  form.pipe(reqHttps);

  res.send('Received data');
    return;
  }
   if (!req.file && !req.body.text) {
    return res.status(400).send('Invalid request');
  }

  form.append('chat_id', chatId);

  https.request(`https://api.telegram.org/bot${botToken}/sendDocument?chat_id=${chatId}`, {
    method: 'POST',
    headers: form.getHeaders()
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(JSON.parse(data));
    });
  }).on('error', (err) => {
    console.error(err);
  }).end(form.getBuffer());

  res.send('Received data');
});


app.post('/', upload.none(), (req, res) => {
  const form = new FormData();
  
  if (req.body.text) {
    console.log(`Received text: ${req.body.text}`);
    form.append('text', req.body.text);
  }

  if (!req.body.text) {
    return res.status(400).send('Invalid request');
  }

  form.append('chat_id', chatId);

  const options = {
    method: 'POST',
    headers: form.getHeaders(),
  };

 https.request(`https://api.telegram.org/bot${botToken}/sendDocument?chat_id=${chatId}`, { 
  method: 'POST',
  headers: form.getHeaders()
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
}).on('error', (err) => {
  console.error(err);
}).end(form.getBuffer());

});

  

app.listen(3000, () => console.log('Server started on port 3000'));
