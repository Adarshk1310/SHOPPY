import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProductList.module.css";
import { useNavigate } from "react-router-dom";
import { actions, itemSelector } from "../../itemReducer";
import Carousel from "../Carousel/carousel";
import {GridLoader} from "react-spinners";
import { toast } from "react-toastify";



const ProductList = () => {

    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { products, category, mensclothing, womensclothing, electronics, health, jewellery,minPrice,carousel } = useSelector(itemSelector);
    const [price,setPrice] =useState(1000000);    
    const [itemSize,setItemSize]=useState("S");




    useEffect(() => {

        const getproducts = async () => {
            let result = await fetch('http://localhost:8000/');
            result = await result.json();
            dispatch(actions.setProducts(result.products));
        }

        getproducts();
        
        setTimeout(()=>{
            setLoading(false);

        },100)



    },[dispatch]);


    const handleMensClothing = (e) => {
        const checked  = e.target.checked;
        if (checked) {

            dispatch(actions.setMensClothing(true));
            dispatch(actions.setCategory(true));

        } else {
            dispatch(actions.setMensClothing(false));
            

        }


    };
    const handleWomensClothing = (e) => {
        const checked  = e.target.checked;
        if (checked) {
            dispatch(actions.setWomensClothing(true));
            dispatch(actions.setCategory(true));


        } else {
            dispatch(actions.setWomensClothing(false));
        
        }

    }
    const handleElectronics = (e) => {
        const checked =e.target.checked;
        if (checked) {
            dispatch(actions.setElectronics(true));
            dispatch(actions.setCategory(true));

        } else {
            dispatch(actions.setElectronics(false));
           
        }
     }
    const handleJewellery = (e) => {
        const checked =e.target.checked;
        if (checked) {
            dispatch(actions.setJewellery(true));
            dispatch(actions.setCategory(true));

        } else {
            
            dispatch(actions.setJewellery(false));

            

        }
     }
    const handleHealth = (e) => {
        const checked =e.target.checked;

        if (checked) {
            dispatch(actions.setHealth(true));
            dispatch(actions.setCategory(true));


        } else {
            
            dispatch(actions.setHealth(false));

         
        }
     }


     const handleViewImage =(url)=>{

        dispatch(actions.setImageUrl(url));
        dispatch(actions.setCarousel());

     }

    const handleRange=(e)=>{

        setPrice(e.target.value);
        dispatch(actions.setMinPrice(e.target.value));
    
    }


    const handleAdd = async(item)=>{
        let userId = JSON.parse(localStorage.getItem('user'));
        let token = localStorage.getItem('auth');
        let size= itemSize;
        if(!item.size){
            size=null;
        }

        if(userId && token){

            let result = await fetch('http://localhost:8000/add',{
                method:'post',
                body:JSON.stringify({userId:userId._id, item:item,itemSize:size}),
                headers:{
                    'content-type':'application/json',
                    authorization:`${JSON.parse(token)}`
                }
            })
    
            result = await result.json();
           
            if(result.item){
                setItemSize("S");
                toast.success(`${result.item} -- Added to cart`);
                
                
            }else{
                toast.error(`${result.error}--- already added. Please got to cart`);
            }
            
        }else{
            toast.error("Login First to Add Product");
            navigate('/login');
        }

       

    }






    return <>  
    {loading?<GridLoader   color="#000" size={21}  cssOverride={{left: '49%',position: 'absolute',top: '40%' }}/>:<>

        <div className={styles.ProductsPage}>
            <div className={styles.filterPage}>

                <div><h2>Filter</h2></div>
                <div className={styles.category}>
                    <h3>Category</h3>
                    <div><input type="checkbox" onClick={handleMensClothing} value="men's clothing"></input><span>Men's Clothing</span></div>
                    <div><input type="checkbox" onClick={handleWomensClothing} value="women's clothing"></input><span>Women's Clothing</span></div>
                    <div><input type="checkbox" onClick={handleElectronics} value="electronics"></input><span>Electronics</span></div>
                    <div><input type="checkbox" onClick={handleJewellery} value="jewellery"></input><span>Jewellery</span></div>
                    <div><input type="checkbox" onClick={handleHealth} value="health"></input><span>Health</span></div>
                    <h3>Price Range</h3>
                    <h2> &#x20B9;{minPrice===1000000? "0" :price}</h2>
                    <input type="range" className={styles.rangeone} name="points" min="0" max="350000" step="500"  onChange={handleRange}></input>

                    
                </div>

            </div>
            <div className={styles.items}>


                {products.map((item, i) => <>{!category && item.price <= minPrice ?

                    < div key={i} className={styles.itemCard}>
                    <div className={styles.imgDiv}><img src={item.url} alt="" onClick={()=>handleViewImage(item.url)}></img></div>
                    <div className={styles.itemInfo}>
                        <small>{item.name}</small>
                        {item.size ? <small><select onChange={(e)=>{setItemSize(e.target.value);console.log("item size:",e.target.value)}}><option >S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></small> : <small></small>}
                        <small className={styles.price}>&#x20B9;{item.price}<button className={styles.addbutton} onClick={()=>{handleAdd(item)}} >Add</button></small>
                    </div>

                </div >    :   null } </>

                        )}


            {products.map((item, i) => <>{ item.category === "men's clothing" && mensclothing && item.price <= minPrice?

                < div key={i} className={styles.itemCard}>
                <div className={styles.imgDiv}><img src={item.url} alt="" onClick={()=>handleViewImage(item.url)}></img></div>
                <div className={styles.itemInfo}>
                    <small>{item.name}</small>
                    {item.size ? <small><select onChange={(e)=>{setItemSize(e.target.value);console.log("item size:",e.target.value)}}><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></small> : <small></small>}
                    <small className={styles.price}>&#x20B9;{item.price}<button className={styles.addbutton} onClick={()=>{handleAdd(item)}}>Add</button></small>
                </div>

            </div >:null } </>
            )}


                {products.map((item, i) => <>{ item.category === "women's clothing" && womensclothing && item.price <= minPrice?

                < div key={i} className={styles.itemCard}>
                <div className={styles.imgDiv}><img src={item.url} alt="" onClick={()=>handleViewImage(item.url)}></img></div>
                <div className={styles.itemInfo}>
                    <small>{item.name}</small>
                    {item.size ? <small><select onChange={(e)=>{setItemSize(e.target.value);console.log("item size:",e.target.value)}}><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></small> : <small></small>}
                    <small className={styles.price}>&#x20B9;{item.price}<button className={styles.addbutton} onClick={()=>{handleAdd(item)}}>Add</button></small>
                </div>

                </div >:null } </>
                )}  



                {products.map((item, i) => <>{ item.category === "electronics" && electronics && item.price <= minPrice?

                < div key={i} className={styles.itemCard}>
                <div className={styles.imgDiv}><img src={item.url} alt="" onClick={()=>handleViewImage(item.url)}></img></div>
                <div className={styles.itemInfo}>
                    <small>{item.name}</small>
                    {item.size ? <small><select onChange={(e)=>{setItemSize(e.target.value);console.log("item size:",e.target.value)}}><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></small> : <small></small>}
                    <small className={styles.price}>&#x20B9;{item.price}<button className={styles.addbutton} onClick={()=>{handleAdd(item)}}>Add</button></small>
                </div>

                </div >:null } </>
                )}  




                {products.map((item, i) => <>{ item.category === "jewellery" && jewellery && item.price <= minPrice?

                < div key={i} className={styles.itemCard}>
                <div className={styles.imgDiv}><img src={item.url} alt="" onClick={()=>handleViewImage(item.url)}></img></div>
                <div className={styles.itemInfo}>
                    <small>{item.name}</small>
                    {item.size ? <small><select onChange={(e)=>{setItemSize(e.target.value);}}><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></small> : <small></small>}
                    <small className={styles.price}>&#x20B9;{item.price}<button className={styles.addbutton} onClick={()=>{handleAdd(item)}}>Add</button></small>
                </div>

                </div >:null } </>
                )}  




                {products.map((item, i) =><> {item.category === "health" && health && item.price <= minPrice?

                    
                < div key={i} className={styles.itemCard}>
                <div className={styles.imgDiv}><img src={item.url} alt="" onClick={()=>handleViewImage(item.url)}></img></div>
                <div className={styles.itemInfo}>
                    <small>{item.name}</small>
                    {item.size ? <small><select onChange={(e)=>{setItemSize(e.target.value);console.log("item size:",e.target.value)}}><option >S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></small> : <small></small>}
                    <small className={styles.price}>&#x20B9;{item.price}<button className={styles.addbutton} onClick={()=>{handleAdd(item)}}>Add</button></small>
                </div>

                </div > :null
                
            }</>
                )}  

 



    </div >

        </div >
        {carousel &&    <Carousel />}</>}
        
    
    </>
}


export default ProductList;