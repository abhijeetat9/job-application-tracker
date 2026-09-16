const mongoose = require('mongoose');

async function  connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;