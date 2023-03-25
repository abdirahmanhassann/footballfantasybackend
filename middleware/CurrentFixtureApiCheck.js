const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const {getDb}=require('../db')


function currentfixturrapicheck(req,res,next){
    const db=getDb()
    
    fetch("https://v3.football.api-sports.io/fixtures/rounds?season=2022&league=39&current=true", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": process.env.API_KEY3
	}
})
.then(res=>res.json())
.then(async response => {
	console.log(response);
    const result = await db.collection('currentfixture').replaceOne({},{ current: response });
res.status(200).send(result.current)
next()
})
.catch(err => {
    console.log(err);
    res.status(401).send(err)
});

}

module.exports=currentfixturrapicheck