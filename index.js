const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require("./middleware/auth.js");
const { User } = require("./models/User");

const config = require('./config/key');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // 이 옵션을 추가해 주세요.
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {console.log(req.cookies);
res.send('Hello World! 야호')
});

app.post('/api/users/register', async (req, res) => { 
  try {
    const user = new User(req.body);
    await user.save(); 
    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    // 비밀번호 비교
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

    // 토큰 생성 및 쿠키에 저장
    const userWithToken = await user.generateToken();
    res.cookie("x_auth", userWithToken.token).status(200)
      .json({ loginSuccess: true, userId: userWithToken._id });
  } catch (err) {
    return res.status(500).json({ loginSuccess: false, message: "로그인에 실패했습니다." });
  }
});



app.post('/app/users/auth', auth, (req, res) => {

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" }
    );

    return res.status(200).send({
      success: true
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}`));
