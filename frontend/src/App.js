import './App.css';
import Login from "./components/Login/Login.jsx";
import Navbar from './components/Navbar/Navbar.jsx';
import {useIsAuthenticated} from"react-auth-kit";

import ProductList from './components/ProductList/ProductList.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import Cart from './components/Cart/Cart.jsx';
import Orders from './components/Orders/Orders.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Navigate, RouterProvider, createBrowserRouter} from "react-router-dom";




function App() {
  

  const isAuthenticated = useIsAuthenticated();



    const router = createBrowserRouter([
      {
        path:'/',
        element:<Navbar />,
        children:[
          {index:true,element:<ProductList />},
          {
            path:'/login',element:<Login />
          },
          {
            path:'/signup',element:<SignUp />
          },
          {
            path:'/userCart',children:[
              {
                path:':id',children:[
                  {
                    path:'cart',element:isAuthenticated()?<Cart />:<Navigate to={'/'}/>
                  }
                ]
              }
            ]
          },
          {
            path:'/userOrders',children:[
              {
                path:':id',children:[
                  {
                    path:'orders',element:isAuthenticated()?<Orders />:<Navigate to={'/'}/>
                  }
                ]
              }
            ]
          }
        ]
      }

    ])

    return (

    <div className="App">
    <ToastContainer autoClose={1000}  />
 
     <RouterProvider router={router}/>
    </div>
  );
}

export default App;
