const {getDb}=require('../db')

async function removePlayer(req,res,next)
{
const {player}=req.body
const {cost}=req.body;
const {email}=req.email
console.log(player,email)
const db=await getDb();
console.log('this is remove plyer')
// const returnTeam2=  await db.collection('users').find(`team.${player}`)

// await db.collection('users').updateOne({email},{
//     $inc: { budget: +player.nowCost }   
// },
// { returnOriginal: false },
// function(err, result) {
//   if (err) throw err;
//   console.log(`${result.value.email} updated`);
//   client.close();
// })
console.log(cost)
await db.collection('users').updateOne(
    { email },
    [
      {
        $set: { 
          budget: { $ifNull: ['$budget', 0] },
          [`team.${player}`]: null,
          budgetUpdated: { $cond: { if: { $eq: ['$budget', null] }, then: null, else: new Date() } }
        },
      },
      {
        $set: { 
          budget: { $add: ['$budget', cost] },
          [`team.${player}`]: { $cond: { if: { $eq: ['$budgetUpdated', null] }, then: null, else: `$team.${player}` } },
        },
      },
    ],
    function(err, result) {
      if (err) throw err;
      console.log(`${result.matchedCount} document(s) matched, ${result.modifiedCount} document(s) modified`);
      client.close();
    }
  );
  
const returnTeam=  await db.collection('users').findOne({email})
res.send({team: returnTeam.team,budget:returnTeam.budget,matches:req.match})

}

module.exports=removePlayer;