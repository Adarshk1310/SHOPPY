import {GridLoader} from "react-spinners";
import { useEffect ,useState} from "react";
import styles from "./orders.module.css";
import { useDispatch, useSelector } from "react-redux";
import { actions, itemSelector } from "../../itemReducer";
import { toast } from "react-toastify";
import {useAuthHeader,useAuthUser} from 'react-auth-kit'


const Orders = ()=>{


  const [loading,setLoading] = useState(true);

  const auth = useAuthUser();
  const userId = auth();
  const dispatch =useDispatch();
  const{orderProducts} = useSelector(itemSelector);
  const authHeader = useAuthHeader();
  const token= authHeader();



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



  useEffect(()=>{

    const getproducts=async ()=>{
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

    getproducts();
    setTimeout(()=>{setLoading(false)},500);
  },[token,userId._id,dispatch])




  const handleCancel =async(item,orderId)=>{


    let result = await fetch("http://localhost:8000/cancelorderitem", {
        method: "delete",
        body: JSON.stringify({ userId: userId._id,item:item,orderId}),
        headers: {
          "content-type": "application/json",
          authorization:token
        },
      });
      result = await result.json();
      getOrderProducts();
      toast.success(`Order item cancelled Successfully `);
      console.log(result);

  }



    return <>
    <div className={styles.orderPage}>
        <div className={styles.orderCard}>
            <h1>MY ORDERS</h1>
            {loading?<GridLoader   color="#000" size={21}  cssOverride={{left: '49%',position: 'absolute',top: '40%' }}/>:<>
          {orderProducts.map((item)=><>
          {item.products.map((prod,i)=><>  
          
          
            <div className={styles.orderList} key={i}>
                <div className={styles.orderHeadings}>
                <div><p>ORDER ID</p><p>{item.orderid}</p></div>
                    <div><p>ORDER PLACED</p><p>{item.date}</p></div>
                    <div className={styles.orderStatus}><p>STATUS</p><p>{item.status}</p></div>
                    <div></div>
                </div>
                <div className={styles.orderInfoDiv}>
                <div className={styles.itemInfo}>
                        <div className={styles.imageDiv}><img src={prod.url} alt="itemImage"></img></div>
                        <div className={styles.productinfo}>
                            <p>{prod.name}</p>
                            <p>{prod.size?`Size - ${prod.size}`:null}</p>
                            <p>Qty - {prod.quantity}</p>
                           <button className={styles.cancelButton} onClick={()=>{handleCancel(prod,item.orderid)}}><img src="https://cdn-icons-png.flaticon.com/128/2961/2961937.png" alt="cancelItem"></img>Cancel Item</button>

                        </div>
                </div>
                <div className={styles.itemPriceDiv}>
                <table>
                <tbody>
                  <tr>
                    <td className={styles.subTotal}>Sub Total :</td>
                    <td className={styles.subTotal}>&#x20B9;{prod.price*prod.quantity}</td>
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
                    <td>&#x20B9;{item.discount ?(0.1*(prod.price*prod.quantity)) : "0.00"}</td>
                  </tr>
                  <tr>
                    <td className={styles.totalAmountH}>Total Amount :</td>
                    <td className={styles.totalAmount}>  &#x20B9;{item.discount? (prod.price*prod.quantity-((0.1*(prod.price*prod.quantity)))):prod.price*prod.quantity} </td>
                  </tr>
                </tbody>
              </table>
                </div>
                </div>
            </div>



          
                  </>)}
          

            </>)}

            </>}
            
            </div>    
        
        </div>    
    
    </>
}


export default Orders;