// testing stable  save of harddisk and forward
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let finalfile; // Define finalfile as a global variable
const app = express();
const uploadDir = 'uploads/';

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

const upload = multer({ storage: storage });

app.use(express.json()); 
app.post('/', upload.single('file'), (req, res) => {
    if (req.file) {
      console.log(`Received file: ${req.file.originalname}`);
      finalfile = `${req.file.filename}`;
      console.log(`Received file: ${finalfile}`);
    }
    
  if (req.body.test) {
    console.log(`Received text: ${req.body.test}`);
    const finaltext = `${req.body.test}`;
console.log(`${finaltext}`);
  }
  if (req.file || req.body.test) {
    res.send('Received data');
  } else {
    res.status(400).send('Invalid request');
  }
});
 
app.listen(3000, () => console.log('Server started on port 3000'));


const FormData = require('form-data');
const fetch = require('node-fetch');

//filename = `${basename}_${i}${ext}`;
const realfinalfile = `${uploadDir}${finalfile}`;
const file_path = `${realfinalfile}`;
const message_text = '<message_text>';

const chat_id = '106123406';
  const bot_token = 'af3w3f3hbj234hjb23k';

if (fs.existsSync(file_path)) {
  const form = new FormData();
  form.append('chat_id', chat_id);
  form.append('document', fs.createReadStream(file_path));
  form.append('caption', message_text);

  fetch(`https://api.telegram.org/bot${bot_token}/sendDocument`, {
    method: 'POST',
    body: form
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
} else {
  console.log(`File not found: ${file_path}`);
}
