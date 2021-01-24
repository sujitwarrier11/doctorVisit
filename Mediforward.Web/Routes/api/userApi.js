const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const User = require('../../models/User');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const path = require('path');

module.exports = function(client){

  router.post('/register', auth.optional, (req, res, next) => {
    const { body: { user } } = req;
     console.log("called reg",user);
    if(!user.username) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    const finalUser = User.getUserObject(user, client);
  
  
    return finalUser.save()
      .then(() => res.json({ user: finalUser.toJson() })).catch(err => res.json({ error: err }));
  });

  router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;
  
    if(!user.username) {
      return res.status(200).json({
        errors: {
          username: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(200).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      console.log("error",err);
      if(err) {
        res.status(200);
        res.json(err);
      }
  
      if(passportUser) {
        req.login(passportUser, errObj => {
          if(!errObj){
            const user = passportUser;
            user.token = passportUser.generateJWT();
            return res.json({ user: user.toJson() });
          }
          else{
            res.status(200);
            res.json(errObj);
          }
        })
  
       
      }
  
      
    })(req, res, next);
  });
  
  
 

  router.get('/test',auth.optional, (req,res,next) => {
    res.json({
      success: true
    })
  });

  router.post('/upload',auth.required, (req,res, next) => {
      const user = req.user;
      const { file } = req.body;
      if(file){
      console.log("file",file)
      const extension = file.name.split('.')[1];
      var bitmap = new Buffer(file.image,'base64');
      const fileName = `${uuid()}.${extension}`
      fs.writeFile(path.join(__dirname, `../../public/${fileName}`),bitmap,(errObj)=>{
        if(errObj){
          res.json({
            error: 'could not save.'
          })
        }
        console.log("inside write")
        const objUser = User.getUserObject(user,client);
        objUser.UpdateFiles({
          fileName,
          displayName: file.name
        }).then(files =>{
          res.json({
            files
          })
        }).catch(err => res.json(err));
      });
    }
    else{
      res.json({
        error: 'something went wrong.'
      })
    }
  });

  router.post('/getFiles',auth.required, (req,res, next) => {
    const user = req.user;
    const objUser = User.getUserObject(user,client);
    objUser.GetFiles().then(files =>{
      res.json({
        files
      })
    }).catch(err => res.json(err));
  });

  return router;
};


