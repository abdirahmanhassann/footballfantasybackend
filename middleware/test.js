const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const {getDb}=require('../db')

async function test(req,res,next){
    const db=await getDb()

    const dbplayers=await db.collection('players').findOne()
console.log(dbplayers)
const uniquePlayers = dbplayers.players.filter((playerObj, index) =>
  index === dbplayers.players.findIndex(obj => (
    obj.player.id === playerObj.player.id && 
    obj.player.name === playerObj.player.name
  ))
);

await db.collection('players').replaceOne({},{players:uniquePlayers})
res.send(uniquePlayers)
}

module.exports=test