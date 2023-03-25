
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {getDb}=require('../db')
async function Loadnews(req,res,next){
const db=getDb()

    const result = await db.collection('news').findOne({});

    res.status(200).send({res:result})

}

module.exports= Loadnews