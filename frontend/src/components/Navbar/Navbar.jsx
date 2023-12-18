import styles from './navbar.module.css';
import Logo from'../../Logo.png';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { actions } from '../../itemReducer';
import { useSignOut } from 'react-auth-kit';
import {useAuthHeader} from 'react-auth-kit'
import {useAuthUser} from 'react-auth-kit';


const Navbar =()=>{

     const auth = useAuthUser();
    const user = auth();
    const navigate =useNavigate();
    const dispatch =useDispatch();
   const signOut = useSignOut();
   const authHeader = useAuthHeader();
   const token= authHeader();

    const handlelogout=()=>{
        
        signOut();
        toast.success("Logout successfull !! ")
        navigate('/');
    }

    const handleSearch =async(e)=>{
        let key = e.target.value;

        let firstLetter = key.charAt(0).toUpperCase();
        let rest = key.substring(1);
        key=firstLetter + rest;

      
        if(key){
            let result = await fetch(`http://localhost:8000/search/${key}`,{
                headers:{
                    authorization:token
                }
            });

            result = await result.json();
            if(result){
               
                dispatch(actions.setProducts(result));
            }

        }else{
            
                let result = await fetch('http://localhost:8000/');
                result = await result.json();
    
                dispatch(actions.setProducts(result.products));
    
        }

    }

    const handleLogo=()=>{

        dispatch(actions.setMinPrice(1000000));
        window.location.reload(false);
        navigate('/');        

    }

    const searchicon=()=>{
        navigate('/');
    }
    



    return<>
         <nav className={styles.navbar}>
        <div className={styles.imageDiv}><img src={Logo} alt="websiteLogo" onClick={handleLogo}></img></div>
        <div className={styles.navButtons}>
            
        <input  type='text' className={styles.searchbar} placeholder='Search..' onChange={handleSearch}  ></input>
        <img src='https://cdn-icons-png.flaticon.com/128/2731/2731146.png' onClick={searchicon} alt='searchicon'></img>
            <ul className={styles.navUl}>
            <Link to={'/'}><li >Home</li></Link>
            {!user?<><Link to={'/login'}><li>Login</li></Link>
            <Link to={'/Signup'}><li>SignUp</li></Link></> :<>
            <Link to={`userOrders/${user._id}/orders`}><li>Orders</li></Link>
            <Link to={`userCart/${user._id}/cart`}><li>Cart</li></Link>
            <li onClick={handlelogout}>Logout</li></>}

            </ul>
        </div>
        </nav>
        <Outlet />

    </>
}


 export default Navbar;