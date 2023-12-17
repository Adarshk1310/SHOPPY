const express =require('express');
const cors =require('cors');

const app = express();
const db =require('./config/config.js');
app.use(express.json());
app.use(cors());

app.use('/',require('./routes'));

app.listen(8000,(err)=>{
    if(err){
        console.log("error:",error);
    }
    console.log("Server running on Port: 8000");
})