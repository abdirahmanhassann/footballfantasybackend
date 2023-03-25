const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const {getDb}=require('../db');

async function updateRating (req,res,next) {
  const db=await getDb();

  // for (let i = 1; i <=44; i++) {
  //   await new Promise((resolve) => {
  //     setTimeout(() => {
  //       fetch(`https://v3.football.api-sports.io/players?league=39&season=2022&page=${i}`, {
  //         headers: {
  //           'x-rapidapi-host': 'v3.football.api-sports.io',
  //           'x-rapidapi-key':process.env.API_KEY3
  //         }
  //       })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         playerArr.push(data);
  //         console.log(data);
  //         resolve();
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         resolve();
  //       });
  //     }, 6300);
  //   });
  // }

  
  const player=[]
  
  const combined=[]
  const dbplayers=await db.collection('players').findOne()
const playerArr=dbplayers.players  
 try{ 
  const res1 = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
  const data = await res1.json();
  const footballers = data.elements.filter(element => element.element_type >= 2 && element.element_type <= 4);
  footballers.forEach((i) => { 
    let players={
      totalPoints:i.total_points,
      averagePoints:i.points_per_game,
      firstname:i.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      surname:i.second_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      name:i.web_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      nowcost:i.now_cost,
    }
    player.push(players)
  });}

  catch(err) {
    return err
  }
  await Promise.all(playerArr.map(async (i) => {
    await Promise.all(i.response.map(async (k) => {
      await Promise.all(player.map(async (j) => {
        if (j.firstname===k.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
         && j.surname===k.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "" 
         || k.statistics[0].games.position==='Goalkeeper')) {
            k={
            ...k,
            totalPoints:j.totalPoints,
            averagePoints:j.averagePoints,
            nowCost:j.nowcost
          }  
          
        combined.push(k)
        }
    
    }));
}));
}));

const existingPlayers = await db.collection('players').findOne();
if (existingPlayers) {
  console.log('Replacing existing players data.');
  const result = await db.collection('players').replaceOne({}, { players: combined });
  console.log(result);
}    
else{
  await db.collection('players').insertOne({players:combined})
}

res.send(combined)
}

module.exports = updateRating;
