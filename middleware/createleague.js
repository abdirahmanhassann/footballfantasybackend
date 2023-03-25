const {getDb}=require('../db')
const {ObjectId}=require('mongodb')
async function createleague(req,res,next){
    const db=getDb()
const {league}=req.body;
const {email}=req.email
const nowDate=new Date()

const person=await db.collection('users').findOne({email:email})
console.log(person,'person', email,'email')
const leagues =await db.collection('leagues').insertOne(
    {league: league,owner:email,createdAt:nowDate,players:[person._id]}
    )
    const user=await db.collection('users').findOneAndUpdate({email:email},
        
            {
                $addToSet: {leagues:leagues.insertedId}
            } 
        
         )


         res.status(200).send(user)
}

module.exports=createleague