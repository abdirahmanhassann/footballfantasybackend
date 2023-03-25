const {getDb}=require('../db')
const {ObjectId}=require('mongodb')
async function findleague(req,res,next){
    const db=getDb()
const {email}=req
const{league}=req.body;
console.log(league,email)
const id2=new ObjectId(league)
console.log(id2)
//const user=await db.collection('leagues').findOne({_id:id2})

const user = await db.collection('leagues' ).aggregate(
    [
        {
            $match: { _id: id2 },
          },
        
        {
          $lookup: {
            from: "users",
            localField: "players",
            foreignField: "_id",
            as: "playerss"
          },
          
        } 
    
    ]
      ).toArray()

    

res.status(200).send(user)
}


module.exports=findleague