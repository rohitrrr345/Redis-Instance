import { redis } from "../app.js";


export  const  redisLimiter=({
    limit=20,timer=60,key
})=>async (req,res,next)=>{
    const clientIp=req.headers["x-forwarded-for"] || req.socket.remoteAddress
    const completeKey=`${clientIp}:${key}request_count`;
    const requestCount=await redis.incr(completeKey);
     
    if(requestCount==1){
        await redis.expire(completeKey,timer)
    }
    console.log(completeKey)
    const remainingTime=await redis.ttl(completeKey)
    console.log(remainingTime)
    if(requestCount>limit){
        return res.status(429).send(`To many requests${remainingTime}`);
    }
next()
}