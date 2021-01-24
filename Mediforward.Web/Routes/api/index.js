const express = require('express');
const router = express.Router();


module.exports = function(client){
return router.use('/', require('./userApi')(client));
}
