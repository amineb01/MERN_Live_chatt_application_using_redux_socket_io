const express = require('express')
const router = express.Router();
const { User, validateAdmin } = require('../models/user' )
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');


  router.post('/', async (req, res) => {
    const { error } = validateAdmin( req.body )
    if (error) return res.status(400).send({ "message": error.details[0].message ,is_successful:false })

    let account = await User.findOne({ email: req.body.email })
    if (!account) {
        return res.status(400).send({ message: "cet utilisateur n'existe pas",is_successful:false  })
    }
    const match = await bcrypt.compare(req.body.password, account.password);
    if (!match) return res.status(400).send({ message: "password not match !",is_successful:false  })

    const token = account.generateToken();
    let result = _.pick(account, ['_id', 'email' ]);
    result.token = token;
    result.expiresIn =3600;
    return res.status(200).send({ result: result, is_successful:true })
  })


module.exports = router;
