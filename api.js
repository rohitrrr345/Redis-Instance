export const productsItem=()=>
    new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve({
            products:[
                {
                    id:1,
                    name:"Mac book",
                    price:100,
                },
            ]//temporary apis 
        })
    },3000)
   }) 
   export const productsDetail=(id)=>
    new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve({
            products:[
                {
                    id:id,
                    name:`Mac book${id}`,
                    price:Math.floor(Math.random()*id*100),
                },
            ]
        })
    },3000)
   }) 
   