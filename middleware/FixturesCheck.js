const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const {getDb}=require('../db')


async function FixturesCheck (req,res,next){
const db=getDb();
const newArr=[]
const timeArr= []

const dbData=await db.collection('fixtures').findOne({})

  dbData.fixture.response.forEach((i)=>{
return(
    timeArr.push({date:i.fixture.date,hometeam:i.teams.home.name, awayteam:i.teams.away.name})
)
})

const timeNow = new Date()


for (let eventTime of  timeArr) {
    const eventDate = new Date(eventTime.date);

        const timeDiff = eventDate.getTime() - timeNow.getTime();

        if(timeDiff<=10800000 && timeDiff>=-10800000 ){

newArr.push(eventTime)

}  


}
console.log('newArrr',newArr)
if(newArr.length>0){
    console.log(req?.url)
    if(req?.url ==='/loadplayers'){
        req.match={match:newArr,status:'ongoing'}
        next();
    }
}
else
{
    if(req?.url){
        next()
    }
}

}

module.exports=FixturesCheck;