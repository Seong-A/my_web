const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlenth: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlenth: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')){
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword) {
    const user = this;
  
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, user.password, (err, isMatch) => {
        if (err) return reject(err);
        resolve(isMatch);
      });
    });
  };
  

  userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign(user._id.toString(), 'secretToken');


    user.token = token;
    
    try {
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  };
  
  userSchema.statics.findByToken = function (token) {
    var user = this;
  
    // 프로미스 반환
    return new Promise((resolve, reject) => {
      // 토큰을 decode
      jwt.verify(token, 'secretToken', function (err, decoded) {
        if (err) return reject(err);
        
        // findOne 메서드를 프로미스로 사용
        user.findOne({ "_id": decoded, "token": token })
          .then(user => resolve(user))
          .catch(err => reject(err));
      });
    });
  }
  

const User = mongoose.model('User',userSchema)

module.exports = { User }