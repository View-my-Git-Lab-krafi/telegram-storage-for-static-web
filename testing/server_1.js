// save on hard disk and forward
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const app = express();
const uploadDir = 'uploads/';
const chatId = '10654136';
const botToken = 'fsda32r3g4q34';

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const ext = path.extname(originalname);
    const basename = path.basename(originalname, ext);

    let i = 0;
    let filename = originalname;
    while (fs.existsSync(path.join(uploadDir, filename))) {
      i++;
      filename = `${basename}_${i}${ext}`;
    }
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 52428800 }
});

app.use(express.json());

app.post('/', upload.single('file'), (req, res) => {
  const form = new FormData();
  
  if (req.file) {
    console.log(`Received file: ${req.file.originalname}`);
    form.append('document', fs.createReadStream(req.file.path));
  }

  if (req.body.text) {
    console.log(`Received afsd text: ${req.body.text}`);
    form.append('caption', req.body.text);
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${req.body.text}`)

  }

  if (!req.file && !req.body.text) {
    return res.status(400).send('Invalid request');
  }

  form.append('chat_id', chatId);
  fetch(`https://api.telegram.org/bot${botToken}/sendDocument?chat_id=${chatId}`, {
      method: 'POST',
      body: form
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => {
    if (req.file) {
      fs.unlinkSync(req.file.path); 
    }
  });
  
  res.send('Received data');
});

app.post('/', upload.single('text'), (req, res) => {
  const form = new FormData();
  
  if (req.file) {
    console.log(`------- file: ${req.file.originalname}`);
    form.append('document', fs.createReadStream(req.file.path));
  }

  if (req.body.text) {
    console.log(`Received -----text: ${req.body.text}`);
    form.append('caption', req.body.text);
  }

  if (!req.file && !req.body.text) {
    return res.status(400).send('Invalid request');
  }

  form.append('chat_id', chatId);
  fetch(`https://api.telegram.org/bot${botToken}/sendDocument?chat_id=${chatId}`, {
      method: 'POST',
      body: form
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => {
    if (req.file) {
      fs.unlinkSync(req.file.path); 
    }
  });
  
  res.send('Received data');
});
app.post('/', upload.none(), (req, res) => {
  const form = new FormData();
  
  if (req.body.text) {
    console.log(`Received ++++ text: ${req.body.text}`);
    form.append('text', req.body.text);
  }

  if (!req.body.text) {
    return res.status(400).send('Invalid request');
  }

  form.append('chat_id', chatId);
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}`, {
      method: 'POST',
      body: form
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
  
  res.send('Received data');
});

app.listen(3000, () => console.log('Server started on port 3000'));
