const {getDb}=require('../db')

async function loadleagues(req,res,next){
    const db=getDb()
const {email}=req.email
const details = await db.collection('users' ).aggregate(
[
    {
        $match: { email: email },
      },
    
    {
      $lookup: {
        from: "leagues",
        localField: "leagues",
        foreignField: "_id",
        as: "playeer"
      },
    } ]
  ).toArray()
 //const f=await db.collection('users').aggregate({$lookup:{from:"leagues",localField: "leagues",foreignField:"_id",as:"player"}}).toArray()
//console.log(f)
await res.status(200).send({res:details[0]?.playeer})

}


module.exports=loadleagues;