const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const {getDb}=require('../db')

function fixturesApicheck(){
    const db=getDb()
    fetch("https://v3.football.api-sports.io/fixtures?next=99&league=39", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": process.env.API_KEY3
	}
})
.then(res=>res.json())
.then(response => {
	console.log(response);
 db.collection('fixtures').replaceOne({
    fixture:response
 })

})
.catch(err => {
    console.log(err);
});


}

module.exports=fixturesApicheck;