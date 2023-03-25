
const {getDb}=require('../db')
const {ObjectId}=require('mongodb')
async function joinleague(req,res,next){
    const db=getDb()
const {email}=req.email
const{id}=req.body;
try{

    const idobject=new ObjectId(id)

const user=await db.collection('leagues').findOne({_id:idobject})
console.log({id:idobject})
if(user){

    const person=await db.collection('users').findOneAndUpdate({email:email}
        ,{$addToSet: {leagues:idobject}}
        );
        const personid=person.value._id
        console.log({person:person,personId:personid})
  const add=  await db.collection('leagues').findOneAndUpdate({_id:idobject},
        {$addToSet: {players:personid}}
     )


  await  res.status(200).send({status:200,id:id})
}
else{

    await  res.status(400).send({status:400})
}}
catch(err){
    await  res.status(400).send({status:400})
}

}


module.exports=joinleague