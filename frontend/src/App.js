import './App.css';
import Login from "./components/Login/Login.jsx";
import Navbar from './components/Navbar/Navbar.jsx';
import {Navigate, RouterProvider, createBrowserRouter} from "react-router-dom";
import ProductList from './components/ProductList/ProductList.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import Cart from './components/Cart/Cart.jsx';
import Orders from './components/Orders/Orders.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {

  let user = JSON.parse(localStorage.getItem('user'));
  // const{user} =useSelector(authSelector);


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
                    path:'cart',element:user?<Cart />:<Navigate to={'/'}/>
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
                    path:'orders',element:user?<Orders />:<Navigate to={'/'}/>
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
