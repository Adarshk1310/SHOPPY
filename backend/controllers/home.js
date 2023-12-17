const Cart = require("../models/carts");
const Orders = require("../models/orders");
const Product = require("../models/products");

module.exports.home = async (req, res) => {
  let products = await Product.find({});

  res.send({
    products,
  });
};

module.exports.search = async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.id } },
      { category: { $regex: req.params.id } },
    ],
  });

  res.send(result);
};





module.exports.addProduct = async (req, res) => {
  let user = await Cart.findOne({ userId: req.body.userId });

  if (user) {
    let data = await Cart.findOne({
      userId: req.body.userId,
      "products._id": req.body.item._id,
    });
   

    if (data) {
      res.send({ error:req.body.item.name});
    } else {
      let item = await user.products.push({
        ...req.body.item,
        quantity: 1,
        total: req.body.item.price,
        size:req.body.itemSize
      });
      item = await user.save();

      res.send({ item: req.body.item.name, result: `added to cart` });
    }

  
  } else {
    res.send({ result: "No Cart Found !!!" });
  }
};




module.exports.cartproducts = async (req, res) => {
  
  const result = await Cart.findOne({ userId: req.body.userId }, {});
  if(result){
    res.send({ result });

  }else{
  res.send({ error:"error in finding products" });

  }

};





module.exports.qtyDecrease = async (req, res) => {
  let user = await Cart.updateOne(
    { userId: req.body.userId, "products._id": req.body.prod._id },
    {
      $inc: { "products.$[products].quantity": -1 },
    },
    {
      arrayFilters: [{ "products._id": req.body.prod._id }],
      new: true,
    }
  );

  if (user) {
    res.send({ user });
  } else {
    res.send({ result: "Error in updating" });
  }
};




module.exports.qtyIncrease = async (req, res) => {
  let user = await Cart.updateOne(
    { userId: req.body.userId, "products._id": req.body.prod._id },
    {
      $inc: { "products.$[products].quantity": 1 },
    },
    {
      arrayFilters: [{ "products._id": req.body.prod._id }],
      new: true,
    }
  );

  if (user) {
    res.send({ user });
  } else {
    res.send({ result: "Error in updating" });
  }
};





module.exports.delete = async (req, res) => {
  let user = await Cart.updateOne(
    { userId: req.body.userId},
    { 
        "$pull": {
            "products": {
              "_id": req.body.prod._id
            }
          }
    }
    
  );
  
  let products = await Cart.find({userId:req.body.userId});



  if (user) {
    res.send({products,result: "success" });
  } else {
    res.send({products,result: "Error in deleting" });
  }
};






module.exports.placeOrder= async (req,res)=>{

  let user = await Orders.findOne({ userId: req.body.userId });
  
  if (user) {
   
      let item = await user.products.push({OrderId:req.body.orderId,products:req.body.products,Status:req.body.orderStatus,Date:new Date().toJSON().substring(0,10),SubTotal:req.body.subTotal,Discount:req.body.discount,Total:req.body.total,cancelled:[]});
      item = await user.save();

      let cartResult = await Cart.updateOne({ userId: req.body.userId}, { "$set": {"products": [] } })

      res.send({ item, result: `Order Placed` });
    

  } else {
    res.send({ result: "No User Found !!!" });
  }

}



module.exports.orderProducts=async(req,res)=>{


  const result = await Orders.findOne({ userId: req.body.userId }, {});

  res.send({ result:result.products });

}


module.exports.cancelItem =async(req,res)=>{


  let user = await Orders.updateOne(
    { userId: req.body.userId, "products.OrderId":req.body.orderId},
    { 
        $pull : {
          "products.$[].products" : {"_id":req.body.item._id}
        },
        $push:{
          "products.$[].cancelled" : req.body.item
        },
        
    }
  );

  
  console.log(user);

  res.send({user});


//this is for setting items in Array



//  let user =  await Orders.updateOne(
//   { userId:req.body.userId, "products.OrderId":req.body.orderId },
//   {
//       $set: {
//           "products.$.Discount":0 ,
          
//        }
//   }
// )


}