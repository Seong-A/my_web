const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // 이 옵션을 추가해 주세요.
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! 야호'));

app.post('/register', async (req, res) => { // 비동기 함수로 변경합니다.

  try {
    const user = new User(req.body);

    await user.save(); // await를 사용하여 프로미스를 처리합니다.

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
