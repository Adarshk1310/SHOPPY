// import { useEffect } from "react";
import { useRef } from "react";
import styles from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { actions } from "../../itemReducer";
import { useSignIn } from 'react-auth-kit';




 const SignUp =()=>{
    const nameRef =useRef();
    const emailRef =useRef();
    const passRef =useRef();
    const conpassRef =useRef();
    const navigate =useNavigate();
    const dispatch =useDispatch();
    const signIn = useSignIn();



    const handleRegister= async()=>{

        if(!passRef.current.value && !conpassRef.current.value && !nameRef.current.value && !emailRef.current.value){
            nameRef.current.style.border="2px solid red";
            emailRef.current.style.border="2px solid red";
            passRef.current.style.border="2px solid red";
            conpassRef.current.style.border="2px solid red";

        }
        if(!nameRef.current.value){
            nameRef.current.style.border="2px solid red";
        }else if(!emailRef.current.value){
            emailRef.current.style.border="2px solid red";
        }
        else if(!passRef.current.value){
            passRef.current.style.border="2px solid red";
        }else if(!conpassRef.current.value){
            conpassRef.current.style.border="2px solid red";
        }





        if(passRef.current.value && conpassRef.current.value && nameRef.current.value && emailRef.current.value){

        if(passRef.current.value === conpassRef.current.value){
            let result = await fetch('http://localhost:8000/signup',{
                method:'POST',
                body:JSON.stringify({name:nameRef.current.value,email:emailRef.current.value,password:passRef.current.value}),
               headers:{
                'content-type':'application/json'
               }
            });
            result=await result.json();
            if(result.status===200){

                if(signIn(
                    {
                        token: result.auth,
                        expiresIn:4600,
                        tokenType: "Bearer",
                        authState: result.user,
    
                    }
                )){
                     
                    toast.success("You have successfully signed up !!");
                    navigate('/');
                }else {
                   console.log("Error in signup & token creation");
                }

             
            }else{
    
                navigate('/login');
                toast.error("Something went wrong ! Please check email/password")
            }
         
           
        }else{
            console.log("Error:'Password does not match'");
            nameRef.current.value="";
            emailRef.current.value="";
            passRef.current.value="";
            conpassRef.current.value="";
            dispatch(actions.setCategory(false));
            toast.error("Password doesn't match");
            navigate('/signup');
        }
     
    }else{
        toast.error("Enter missing fields");
    }

    }

    return <>

            <div className={styles.signUp}>

            <div className={styles.signupMain}>
                <div className={styles.loginHeadings}><h1>Welcome to Shopyy</h1><h2>Sign Up with</h2></div>
                <div className={styles.inputDetails}>
                    <small>Name</small>
                    <input type="text" ref={nameRef} placeholder="Enter the name"></input>
                    <small>Email</small>
                    <input type="text" ref={emailRef} placeholder="Enter the email"></input>
                    <small>Password</small>
                    <input type="password" ref={passRef} placeholder="Enter the password"></input>
                    <small>Confirm Password</small>
                    <input type="password" ref={conpassRef}  placeholder="Enter the password"></input>

                </div>
                <div className={styles.buttonInfo}>
                    <div className={styles.buttons}><Link><button onClick={handleRegister}>Submit</button></Link></div>
                    <div><h4>Forgot your password?</h4></div>
                </div>

            </div>
    </div>
    </>
}




export default SignUp;