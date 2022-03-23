const mongoose=require('mongoose');

mongoose.pluralize(null);

let connectionString="mongodb://localhost:27017/myGame";

mongoose.connect(connectionString);

module.exports=mongoose;