const express = require('express');
const router = express.Router();

module.exports = function(client){

return router.use('/api', require('./api')(client));

}

