
var admins = require('../routes/admins')
var auth = require('../routes/auth')
var messages = require('../routes/messages')


module.exports = function(app) {
    app.use('/api/admins',admins);
    app.use('/api/auth',auth);
    app.use('/api/messages',messages);

}
