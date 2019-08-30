
var admins = require('../routes/admins')
var auth = require('../routes/auth')


module.exports = function(app) {
    app.use('/api/admins',admins);
    app.use('/api/auth',auth);
  }
