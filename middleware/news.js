
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {getDb}=require('../db')
function news(req,res,next){
const db=getDb()

    fetch('https://gnews.io/api/v4/search?q="premier league"&token=a0ef6727e3c457e427abe7f92e3c2077')
.then((res)=>res.json())
.then(async (res1)=>{
    const result = await db.collection('news').replaceOne({}, { news: res1 });
})
}

module.exports= news;