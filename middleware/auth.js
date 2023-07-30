const { User } = require('../models/User');


let auth = (req, res,next) => {

    //인증처리 하는 곳
    //클리이언트 쿠키에서 토큰 가져옴
    let token = req.cookies.x_auth;
    //토큰 복호화 한 후 유저를 찾음
    User.findByToken(token)
        .then(user => {
            if (!user) return res.json({ isAuth: false, error: true });
  

            req.token = token;
            req.user = user;
            next();
        })
        .catch(err => {
            throw err; // 또는 적절한 오류 처리를 수행하세요.
        })
}
module.exports = { auth };