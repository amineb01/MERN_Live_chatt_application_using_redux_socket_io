const mongoose = require('mongoose');
const Joi = require ('joi');
var Schema = mongoose.Schema;

Joi.objectId = require('joi-objectid')(Joi);


  const messageSchema = new Schema({
    receiver   : { type: mongoose.Schema.Types.ObjectId,ref: 'User' },
    sender     : { type: mongoose.Schema.Types.ObjectId,ref: 'User' },
    msg        : { type: String, required: true },
    sentAt     : { type: Date  ,required: false ,default:Date.now() },
  });

  function validateMessage(asso) {
      const schema = ({
        receiver        : Joi.string().required(),
        sender          : Joi.string().required(),
        msg             : Joi.string().required()
       });

      return Joi.validate(asso, schema);
  }

var Message = mongoose.model('Message', messageSchema);

module.exports.Message = Message;
module.exports.validateMessage= validateMessage;
