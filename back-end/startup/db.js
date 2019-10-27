const mongoose = require('mongoose');

module.exports=function(){
 mongoose.connect(process.env.search_db ||"mongodb://localhost:27017/test", { useCreateIndex: true, useNewUrlParser: true })
    .then(()=>console.log('connect to test database ..'))
    .catch((err)=>console.log(err));
}
