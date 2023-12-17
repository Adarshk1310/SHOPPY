

const mongoose =require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/shoppy');

const db =mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to mongoDb"));
db.once('open',function(){
    console.log('Connected to Database:: MongoDB');
});

module.exports.db;