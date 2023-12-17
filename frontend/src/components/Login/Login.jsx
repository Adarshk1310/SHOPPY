import { useEffect,useRef } from "react";
import styles from "./login.module.css";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { actions } from "../../itemReducer";
 const Login =()=>{

    const emailRef =useRef();
    const passRef =useRef();
    const navigate =useNavigate();
    const dispatch =useDispatch();
    useEffect(()=>{
            let user =localStorage.getItem('user')
            if(user){
                navigate('/');
            }
    })

    const handleLogin=async()=>{

        
        
        if(!emailRef.current.value && !passRef.current.value){

            emailRef.current.style.border =" 2px solid red";
            passRef.current.style.border =" 2px solid red";
        }
        else if(!emailRef.current.value){

            emailRef.current.style.border =" 2px solid red";
        }else if(!passRef.current.value){
            
            passRef.current.style.border =" 2px solid red";
        }


        if(emailRef.current.value && passRef.current.value){

        let result = await fetch('http://localhost:8000/login',{
            method:'POST',
            body:JSON.stringify({email:emailRef.current.value,password:passRef.current.value}),
            headers:{
                'content-type':'application/json'
            }
        });
        result=await result.json();
        if(result.auth){
         localStorage.setItem('user',JSON.stringify(result.user));
         localStorage.setItem('auth',JSON.stringify(result.auth));
         dispatch(actions.setCategory(false));
         toast.success("Logged in successfully!");
         navigate('/');
         
        }else{

            navigate('/login');
            toast.error("Something went wrong ! Please check email/password")
        }

    }else if(emailRef.current.value || passRef.current.value){
        toast.error("Please enter missing details");
    }else{
        toast.error("Please enter Email/Password");

    }
       
    }

    return <>

            <div className={styles.loginPage}>

            <div className={styles.loginMain}>
                <div className={styles.loginHeadings}><h1>Welcome to Shopyy</h1><h2>Login with</h2></div>
                <div className={styles.inputDetails}>
                    <small>Email</small>
                    <input type="text" ref={emailRef} placeholder="Enter the email"></input>
                    <small>Password</small>
                    <input type="password" ref={passRef} placeholder="Enter the password"></input>

                </div>
                <div className={styles.buttonInfo}>
                    <div className={styles.buttons}><Link ><button onClick={handleLogin}>Login</button></Link><Link to={'/signup'}><button>Sign Up</button></Link></div>
                    <div><h4>Forgot your password?</h4></div>
                </div>

            </div>
    </div>
    </>
}




export default Login;