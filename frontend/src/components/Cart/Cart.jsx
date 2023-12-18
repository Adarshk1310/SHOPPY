import { useEffect, useRef, useState } from "react";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actions, itemSelector } from "../../itemReducer";
import { toast } from "react-toastify";
import Carousel from "../Carousel/carousel";
import {GridLoader} from "react-spinners";
import {useAuthUser} from 'react-auth-kit';
import {useAuthHeader} from 'react-auth-kit'




const Cart = () => {


  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const token= authHeader();
  const userId = auth();
  const dispatch = useDispatch();
  const { cartProducts, totalCartCost, subTotal, carousel, coupon } = useSelector(itemSelector);
  const couponRef = useRef();
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading,setLoading] = useState(true);


  const getproducts=async()=>{

    let result = await fetch("http://localhost:8000/cartproducts", {
        method: "post",
        body: JSON.stringify({ userId: userId._id }),
        headers: {
          "content-type": "application/json",
          authorization:token
          
        },
      });
      result = await result.json();

      if (result) {
        dispatch(actions.setCartProducts(result.result.products));
      }

     

  }





  useEffect(() => {

    const getCartProducts = async () => {
      let result = await fetch("http://localhost:8000/cartproducts", {
        method: "post",
        body: JSON.stringify({ userId: userId._id }),
        headers: {
          "content-type": "application/json",

        },
      });
      result = await result.json();
      if (result) {
        dispatch(actions.setCartProducts(result.result.products));
      }
    };

    getCartProducts();
    setLoading(false);
  }, [userId._id, dispatch]);





  useEffect(() => {
    
      const cost = cartProducts.map((item) => item.total*item.quantity).reduce((acc, current) => acc + current, 0);

      dispatch(actions.setsubTotal(cost.toFixed(2)));
      dispatch(actions.setTotalCost(cost.toFixed(2)));

  }, [dispatch, cartProducts]);





  const handleViewImage = (url) => {
    dispatch(actions.setImageUrl(url));
    dispatch(actions.setCarousel());
  };






  const handleRedeem = (coup) => {
    if ("adarsh10" === coup) {
      setCouponApplied(true);
      let discount = 0.1 * totalCartCost;
      discount = discount.toFixed(2);
      let total = subTotal - discount;
      setTotalDiscount(discount);
      dispatch(actions.setTotalCost(total.toFixed(2)));
      toast.success("Coupon applied successfully !!");
      dispatch(actions.setCoupon(""));
      couponRef.current.value="";
    }else{
      setCouponApplied(false);
      dispatch(actions.setTotalCost(subTotal));
      setTotalDiscount(0);

      dispatch(actions.setCoupon(""));
      couponRef.current.value="";
      
    }
  };




  const handleDecrease = async (prod) => {

    if(prod.quantity===1){
      handleDelete(prod);
    }
    let result = await fetch("http://localhost:8000/cartItem/qtyDecrease", {
      method: "post",
      body: JSON.stringify({ userId: userId._id, prod: prod }),
      headers: {
        "content-type": "application/json",
        authorization:token
      },
    });
    result = await result.json();
    getproducts();
    setTotalDiscount(0);
    setCouponApplied(false);

    if(result.result){
        toast.error("Error in decreasing");
    }
  };




  const handleIncrease = async (prod) => {

    let result = await fetch("http://localhost:8000/cartItem/qtyIncrease", {
      method: "post",
      body: JSON.stringify({ userId: userId._id, prod: prod }),
      headers: {
        "content-type": "application/json",
        authorization:token
        
      },
    });
    result = await result.json();
    getproducts();
    setTotalDiscount(0);
    setCouponApplied(false);
  

    if(result.result){
        toast.error("Error in decreasing");
    }
  };




  const handleDelete=async(prod)=>{
   
    let result = await fetch("http://localhost:8000/cartItem/delete", {
        method: "delete",
        body: JSON.stringify({ userId: userId._id, prod: prod }),
        headers: {
          "content-type": "application/json",
          authorization:token
        },
      });
      result = await result.json();
      getproducts();
      setTotalDiscount(0);
      setCouponApplied(false);

      if(result.result==="success"){
          toast.success(`${prod.name} -- Removed`);
      }else{
        toast.error(result.result);
      }

  }



  
  const getOrderProducts=async()=>{

    let result = await fetch("http://localhost:8000/orderProducts", {
      method: "post",
      body: JSON.stringify({ userId: userId._id }),
      headers: {
        "content-type": "application/json",
        
       
      },
    });
    result = await result.json();
    let updated = result.result.map((item)=>{
     
      return item;
    })
    updated =updated.map((item)=>{
      
      let product =item.products.map((prod)=>{return prod})
      
      return {orderid:item.OrderId,products:product,date:item.Date,status:item.Status,subtotal:item.SubTotal,discount:item.Discount,total:item.Total};
    })

    if(result){
      dispatch(actions.setOrderProducts(updated));
      
    }
}



  const handlePlaceOrder=async()=>{
    let orderId = 'ID' + (new Date()).getTime();
    let result = await fetch(`http://localhost:8000/placeorder`,{
    method:'post',
    body:JSON.stringify({userId: userId._id,products:cartProducts,orderStatus:"CONFIRMED",subTotal:subTotal,total:totalCartCost,discount:totalDiscount,orderId}),
    headers:{
      "content-type": "application/json",
      authorization:token
        
    }
    });

    await result.json();
    

    getOrderProducts();

    toast.success("Order Placed Successfully !");

  }


  return (  <> {loading ? <GridLoader   color="#000" size={21}  cssOverride={{left: '49%',position: 'absolute',top: '40%' }} />: <><div className={styles.cartPage}>
        <div className={styles.cartDiv}>
          <h1>My Cart</h1>
          <div className={styles.headings}>
            <div>
              <span>Item</span>
            </div>
            <div className={styles.itemName}>
              <span>Name</span>
            </div>
            <div>
              <span>Price</span>
            </div>
            <div>
              <span>Qty</span>
            </div>
            <div>
              <span>Total</span>
            </div>
          </div>
          <div className={styles.itemsDiv}>
            <ul>
              {cartProducts.length>0?cartProducts.map((item, i) => (
                <li className={styles.listItems} key={i}>
                  <div className={styles.imgDiv}>
                    <img
                      onClick={() => {
                        handleViewImage(item.url);
                      }}
                      src={item.url}
                      alt="cart"
                    ></img>
                  </div>
                  <div className={styles.itemInfo}>
                    <p>{item.name}</p>
                    <p className={styles.itemSize}>{item.size?`SIZE - ${item.size}`:null}</p>
                  </div>
                  <div>&#x20B9; {item.price}</div>
                  <div className={styles.quantity}>
                    <span>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/512/512619.png"
                        alt="decrease"
                        onClick={() => {
                          handleDecrease(item);
                        }}
                      ></img>
                    </span>
                    {item.quantity}
                    <span>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/864/864380.png"
                        alt="increase"
                        onClick={()=>{handleIncrease(item)}}
                      ></img>
                    </span>
                  </div>
                  <div className={styles.listTotal}>
                    <div> &#x20B9; {item.quantity * item.price}</div>
                    <div>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                        alt="deletebutton"
                        onClick={()=>{handleDelete(item)}}
                      ></img>
                    </div>
                  </div>
                </li>
              )):<h1>Cart is Empty !!</h1>}
            </ul>
          </div>
          <div className={styles.priceInfo}>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className={styles.subTotal}>Sub Total :</td>
                    <td className={styles.subTotal}>&#x20B9;{subTotal}</td>
                  </tr>
                  <tr>
                    <td>Shipping Charge :</td>
                    <td>&#x20B9;0.00</td>
                  </tr>
                  <tr>
                    <td>Sales Tax :</td>
                    <td>&#x20B9;0.00</td>
                  </tr>
                  <tr>
                    <td>Discount :</td>
                    <td>&#x20B9;{totalDiscount ? totalDiscount : "0.00"}</td>
                  </tr>
                  <tr>
                    <td className={styles.totalAmountH}>Total Amount :</td>
                    <td className={styles.totalAmount}>
                      &#x20B9;{totalCartCost ? totalCartCost : "0.0"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.buttonDiv}>
            <div className={styles.redeemDiv}>
              
              <input type="text" onChange={() => { dispatch(actions.setCoupon(couponRef.current.value)); }} placeholder="Enter Coupon" ref={couponRef}></input>
              <button className={styles.redeemButton} onClick={()=>{handleRedeem(coupon)}}>  REDEEM </button>
              {couponApplied ? (<><p> 10% OFF COUPON APPLIED </p> <img src="https://t4.ftcdn.net/jpg/05/42/97/29/240_F_542972988_Kac2KtduaIqGaY4oK7pzdegfiEDEcpYu.jpg"  alt="coupon applied"  ></img> </>) : null}
            </div>
            <Link className={styles.ContinueShopping} to={"/"}>
              <button className={styles.shopping}>Continue Shopping</button>
            </Link>
           <Link className={styles.placeOrder} to={{pathname:`/userOrders/${userId._id}/orders`}} onClick={handlePlaceOrder}><button >Place Order</button></Link>
          </div>
        </div>
      </div>

      {carousel ? <Carousel /> : null}
    </>}
  </>);
};

export default Cart;
