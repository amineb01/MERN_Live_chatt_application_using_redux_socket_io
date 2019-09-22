const express = require('express')
const { User, Citizen, Admin, validateAdmin, validateCitizen} = require('../models/user' )
var bcrypt = require('bcrypt')
let router = express.Router()
const _ = require('lodash');

const auth = require("../midelwares/auth")
const isAdmin = require("../midelwares/isAdmin")



  router.post("/", async (req, res) => {
    let {error}    =  validateAdmin(req.body);
    if (error)  return res.status(200).send({'message':error.details[0].message, is_successful:false});

    var admin= await Admin.findOne({email:req.body.email})
    if (admin) { return res.send({message:"Email déja utilisé !",is_successful:false})}

    const hashpass= await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10) )

    admin= new Admin({
       first_name : req.body.first_name,
       last_name  : req.body.last_name,
       email      : req.body.email,
       password   : hashpass });

    admin = await admin.save();
    if (!admin) { return res.send({message:"Admin ne peut pas etre crée !",is_successful:false})}

    let result = _.pick( admin, [ '_id', 'email' ] );
    const token = admin.generateToken();
    result.token = token;
    result.expiresIn = 60;

    return res.status(200).send({ result: result, is_successful:true })

  })


  router.delete("/:id",[auth,isAdmin], async (req, res) => {
    let admin = await Admin.findByIdAndRemove(req.params.id)
    if (!admin){return res.send({message:"erreur impossible de supprimer cet administrateur",is_successful:false})}
    res.status(200).send({message:"cet admin a été supprimé avec succès !" ,is_successful:true});
  })



  router.get("/:id",[auth,isAdmin], async (req,res) => {
    let admin  = await Admin.findById(req.params.id).populate({path:'municipality',select:['name']})
    if (!admin){res.send("admin n'existe pas")}
    res.status(200).send(admin);
  })



  router.get("/",[auth,isAdmin], async (req, res) => {
    let admins= await Admin.find({ role: { $ne: "Super_Admin" } }).populate({path:'municipality',select:['name']})
                                 .populate({path:'association',select:['name']})
    res.status(200).json(admins);
  })


  router.put('/:id',[auth,isAdmin], async (req,res) => {
    let  admin = await Admin.findOne({_id:req.params.id})
    if (!admin) return res.send({message:"admin introuvable !",is_successful:false})
    const match = await bcrypt.compare(req.body.password, admin.password);
    if (!match)
    { return res.status(200).send({ message: "password not match !",is_successful:false })
    }

    if(req.body.newPassword){
      criptedPassword= await bcrypt.hash(req.body.newPassword, bcrypt.genSaltSync(10))

      admin = await Admin.findOneAndUpdate({_id:req.params.id},{password:criptedPassword,first_name:req.body.first_name})
      if (!admin) return res.send({message:"admin introuvable !",is_successful:false})
      return res.json({message:"cet admin a été mise à jour avec success ! ",is_successful:true});
    }
    return res.json({message:"erreur de mise a jour !",is_successful:false});

  })

   module.exports = router;
