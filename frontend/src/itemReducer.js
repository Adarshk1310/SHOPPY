import { createSlice } from "@reduxjs/toolkit";



const initialState={
    products:[],
    cartProducts:[],
    category:false,
    mensclothing:false,
    womensclothing:false,
    electronics:false,
    health:false,
    jewellery:false,
    minPrice:1000000,
    carousel:false,
    imageUrl:'',
    totalCartCost:null,
    subTotal:null,
    coupon:'',
    orderProducts:[],
    user:null

}


const itemSlice = createSlice({
    name:'item',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            
            state.user = action.payload;
            console.log("user",state.user);
            
            
        },
        setProducts:(state,action)=>{
            
            state.products = [...action.payload];
            
            
        },
        setCartProducts:(state,action)=>{
            
            state.cartProducts = [...action.payload];
            
        },
        setCategory:(state,action)=>{
            state.category = action.payload;
           
        },
        setMensClothing:(state,action)=>{
            state.mensclothing=action.payload;
            if( state.mensclothing || state.womensclothing || state.electronics || state.health || state.jewellery){
                state.category = true;
                   
                }else{
                    state.category = false;
                
                }
        },
        setWomensClothing:(state,action)=>{
            state.womensclothing=action.payload
           
            if( state.mensclothing || state.womensclothing || state.electronics || state.health || state.jewellery){
                state.category = true;
                   
                }else{
                    state.category = false;
                
                }

        },
        setElectronics:(state,action)=>{
            state.electronics=action.payload;
            if( state.mensclothing || state.womensclothing || state.electronics || state.health || state.jewellery){
                state.category = true;
                   
                }else{
                    state.category = false;
                
                }

        },
        setJewellery:(state,action)=>{
            state.jewellery=action.payload;
            if( state.mensclothing || state.womensclothing || state.electronics || state.health || state.jewellery){
                state.category = true;
                   
                }else{
                    state.category = false;
                
                }

        },
        setHealth:(state,action)=>{
            state.health=action.payload;
            if( state.mensclothing || state.womensclothing || state.electronics || state.health || state.jewellery){
                state.category = true;
                   
                }else{
                    state.category = false;
                
                }

        },
        setMinPrice:(state,action)=>{
            if(action.payload===0){
            state.minPrice =1000000;
            }else{
                state.minPrice=action.payload;
            }
        },
        setMaxPrice:(state,action)=>{
            state.maxPrice =action.payload;
    
        },
        setPriceRange:(state,action)=>{
            state.priceRange =action.payload;
        },
        setCarousel:(state,action)=>{
            state.carousel = !state.carousel
        },
        setImageUrl:(state,action)=>{
            state.imageUrl = action.payload
        },
        setTotalCost:(state,action)=>{
            state.totalCartCost =action.payload;
     
        },
        setsubTotal:(state,action)=>{
            state.subTotal =action.payload;
            
        },
        setCoupon:(state,action)=>{
            state.coupon =action.payload;
            
            
        },
        setOrderProducts:(state,action)=>{
            state.orderProducts=action.payload;
        }

    }

})


export const itemReducer = itemSlice.reducer;
export const actions = itemSlice.actions;
export const itemSelector = (state)=>state.itemReducer;