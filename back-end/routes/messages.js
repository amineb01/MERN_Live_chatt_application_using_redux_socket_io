const express = require('express')
const { User } = require('../models/user' )
const { Message } = require('../models/Message' )
let router = express.Router()

const auth = require("../midelwares/auth")

router.get("/",[auth], async (req,res) => {
  let messages  = await Message.find(  { $or:[ { receiver:req.header('receiver'), sender:req.header('sender') }, { sender:req.header('receiver'), receiver:req.header('sender') } ]} ).populate({path:'sender',select:'email'}).populate({path:'receiver',select:'email'})
  if (!messages){res.send([])}
  res.status(200).send(messages);
})



module.exports = router;
