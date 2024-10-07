import express from "express";
import { productsDetail, productsItem } from "./api.js";
import {  redisLimiter } from "./Redis/redis.js";
import Redis from "ioredis";

const app=express();
export const redis=new Redis({
    host:"YOUR-HOST",
    port:'YOUR-PORT',
    password:"YOUR-PASSWORD"
})
redis.on("connect",()=>{
    console.log("redis connected")
})


app.get("/",redisLimiter({limit :30,timer:300,key:"home"}),async(req,res,next)=>{
    res.json({
        success:true,
        message:'Hello from the solar system'
    });
})
app.get('/products',redisLimiter({limit :30,timer:300,key:"rem"}),async(req,res)=>{
    let products =await redis.get("products");
    if(products){
        console.log("get from cache");
        return res.json({
            products:JSON.parse(products)
        });
    }
    products=await productsItem();
 await redis.setex("products",20,JSON.stringify(products.products));
 res.json({
    products,
 })
})
app.get("/product/:id",async(req,res)=>{
    const id=req.params.id;
    const key=`product:${id}`;
    let product=await redis.get(key);
    if(product){
        return res.json({
            product:JSON.parse(product),
        })
    }
    product= await productsDetail(id);
    await redis.set(key,JSON.stringify(product));
    res.json({
        product,
    });
})

app.listen(3000,()=>{
    console.log("Working on the server")
})
export default app;
