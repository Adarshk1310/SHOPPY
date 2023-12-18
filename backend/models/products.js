const mongoose =require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String
    },
    url:{
        type:String
    },
    price:{
        type:Number
    },
    category:{
        type:String
    }
})


const Product = mongoose.model('Products',productSchema);
module.exports = Product;