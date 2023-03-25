


const {getDb}=require('../db')
const {ObjectId}=require('mongodb')


async function leaveleague(req,res,next){
    const db=getDb()
const {email}=req.email
const{leagueid}=req.body;
const leagueIdObj = new ObjectId(leagueid);

const person=await db.collection('users').findOneAndUpdate({email:email}
    ,{$pull: {leagues:leagueIdObj}}
    );

const user=await db.collection('leagues').findOneAndUpdate({_id:leagueIdObj},
    {
     $pull:{players:person.value._id}
    }
    )

    console.log( {idobject:leagueIdObj,[person.value._id]: person.value._id, })
  await  res.sendStatus(200)

}


module.exports=leaveleague