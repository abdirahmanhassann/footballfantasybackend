const {getDb}=require('../db')


async function currentfixture (req,res,next){

    const db=getDb();
    const getinfo=await db.collection('currentfixture').findOne({})
    //console.log(Number(getinfo.current.response[0].slice(17,19)))
    const fixture=Number(getinfo.current.response[0].slice(17,19))
req.currentfixture=fixture;
next()
}


module.exports=currentfixture