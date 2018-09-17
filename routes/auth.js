const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')
const User = require('../models/User')


router.get('/', (req, res, next)=>{

  const password = 'jordy69'
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password,salt)

  res.send(hash)
})

//signup routes
router.get('/signup', (req, res, next)=>{
  res.render('auth/signup')
})

router.post('/signup', (req, res, next)=>{
  const {password, password2, username} = req.body
  
  if(password!==password2)return res.render('auth/signup',{error:'No seas wey, checa tu contraseña'})
  if(zxcvbn(password).score<=1) return res.render('auth/signup',zxcvbn(password).feedback)

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password,salt)
  
  User.create({username:username,password:hash})
    .then(user=>{
      res.send(user)
    }).catch(e=>{
      res.render('auth/signup',{error:e,userinput:req.body})
      next(e)
    })
})

module.exports = router