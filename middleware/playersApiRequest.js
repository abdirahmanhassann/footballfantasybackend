const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const {getDb}=require('../db')
async function playersApiRequest () {
    const playerArr = [];
  const db=getDb();
    for (let i = 1; i <= 44; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          fetch(`https://v3.football.api-sports.io/players?league=39&season=2022&page=${i}`, {
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key':process.env.API_KEY3
            }
          })
          .then((response) => response.json())
          .then((data) => {
            playerArr.push(data);
            console.log(data);
            resolve();
          })
          .catch((error) => {
            console.error(error);
            resolve();
          });
        }, 6500);
      });
    }

    const existingPlayers = await db.collection('players').findOne();
    if (existingPlayers) {
      console.log('Replacing existing players data.');
      const result = await db.collection('players').replaceOne({}, { players: playerArr });
      console.log(result);
    }    
    else{
      await db.collection('players').insertOne({players:playerArr})
    }
  };
  
  module.exports=playersApiRequest