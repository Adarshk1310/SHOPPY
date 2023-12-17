const mongoose =require('mongoose');

const orderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products: [mongoose.Schema.Types.Mixed]
})


const Orders =mongoose.model('orders',orderSchema);

module.exports = Orders;