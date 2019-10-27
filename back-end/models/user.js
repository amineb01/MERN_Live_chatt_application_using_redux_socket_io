const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const Joi = require ('joi');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  first_name : { type: String, required: false, maxlength: 50 },
  last_name  : { type: String, required: false, maxlength: 50 },
  phone      : { type: String, required: false, maxlength: 50 },
  password   : { type: String, required: true, maxlength: 100, minlength: 3 },

},
{ discriminatorKey: 'kind' });

userSchema.methods.generateToken = function () {
return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60),
_id: this.id, kind:this.kind }, 'secretkey');
}

var User = mongoose.model('User', userSchema);




var Admin = User.discriminator('Admin',new Schema({
  email      : { type: String, required: false, maxlength: 50 },
}));

function validateAdmin(admin){

    const schema = ({
        password     : Joi.string().min(3).max(20).required(),
        email        : Joi.string().trim().email().required(),
      });

    return Joi.validate(admin, schema);
  }


var Citizen = User.discriminator('Citizen',new Schema({
  login      : { type: String, required: false, maxlength: 50 },
}));

function validateCitizen( citizen ) {

    const schema = ({
        password     : Joi.string().min(3).max(20).required(),
        login        : Joi.string().trim().email().required(),
      });

    return Joi.validate(citizen, schema);
  }


 module.exports.User           = User;
 module.exports.Admin          = Admin;
 module.exports.Citizen        = Citizen;
 module.exports.validateAdmin  = validateAdmin;
 module.exports.validateCitizen= validateCitizen;
