const mongoose=require('mongoose');
// connect with database
mongoose.connect("mongodb://localhost/authentication");

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in connecting to Database"));

db.once('open', function(){
    console.log('Yuppie! connected to mongoDB!');
})

// module.exports = db;