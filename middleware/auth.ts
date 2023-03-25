require('dotenv').config()
const jwt=require('jsonwebtoken')
const {getDb}=require('../db')
function auth(req,res,next){
    const db= getDb();
const autherization=req.headers['authorization'];
const refresh=req.headers['refresh-token']
const token=autherization && autherization.split(' ')[1];
if(!token)return null;
jwt.verify(token,process.env.ACCESS_TOKEN,async (err,payload)=>{
    if(err){
    if(err.expiredAt < Date.now() && refresh ){
console.log(' token hasss expired')
console.log('refresh',refresh)
console.log(payload,'payload')
const ff=jwt.verify(refresh,process.env.REFRESH_TOKEN)
 const get=await db.collection('users').findOne({email:ff.email})
 console.log('get search')
 console.log(get.refreshToken,'refredshhh')
 if(!get) return res.sendStatus(403)
 console.log('get found')
 const payload2={email:ff.email}

 jwt.verify(payload2,process.env.REFRESH_TOKEN,async(err,payyload)=>{
    console.log('verifying new refresh token')
    if(err.expiredAt < Date.now() && get.refreshToken===refresh) {
        console.log('refresh tokens are equal')
        const newrefresh = jwt.sign(payload2,process.env.REFRESH_TOKEN,{expiresIn:'30m'})
     const newdb=  await db.collection('users').findOneAndUpdate({email:get.email},{$set:{refreshToken:newrefresh}})
        req.email=payload2.email
        next()
    }
else if(err){
        res.sendStatus(403)
    }
else{
    console.log('refresh token verified')
    req.email=payload.email
    next()

}
 })
 console.log('this is the refreshtoken',get)

    }
        res.status(403)
    }
    else{
        console.log(payload,'auth email')
req.email=payload
        next()
    }

})

}


module.exports=auth