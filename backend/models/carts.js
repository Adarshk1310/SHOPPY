const mongoose =require('mongoose');


const cartSchema =mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products: [mongoose.Schema.Types.Mixed]

})


const Cart = mongoose.model('carts',cartSchema);
module.exports =Cart;