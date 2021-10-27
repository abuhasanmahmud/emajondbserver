//emajonDb
//pY6OD9QZSOJOPHtY

const express=require('express');
const cors=require('cors');
require("dotenv").config();
const { MongoClient } = require('mongodb');

const app=express();
const port=process.env.PORT || 5000;

//midle ware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://emajonDb:pY6OD9QZSOJOPHtY@cluster0.10ktf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("online_shop");
        const productCollcation = database.collection("products");
        const orderCollection=database.collection("order")
        //get product api
        app.get('/products',async(req,res)=>{
            const page=req.query.page;
            const size=parseInt(req.query.size);
            const cursor = productCollcation.find({});
            
            const count=await cursor.count();
            
            let products;
            if(page){
                products=await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products= await cursor.toArray();
            }
            res.send({
                count,
                products
            });
           
        });
         //use post get data by keys
         app.post('/products/byKeys',async(req,res)=>{
            console.log(req.body);
            const keys=req.body;
            const quary={key:{$in: keys}}
            const product=await productCollcation.find(quary).toArray();
            res.json(product)
            res.send('hitting');
        });


         //add order api
         app.post('/orders',async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('this is from server');
})

app.listen(port,()=>{
    console.log('all right running',port)
})