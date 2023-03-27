require('dotenv').config()
const express=require('express')
const cors=require('cors')
const app=express()
const admin=require('firebase-admin')
const credentials=require('./football-fantasy-3c451-firebase-adminsdk-dh80g-1ef35d1d52.json')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {connectToDb,getDb}=require('./db')
const {MongoClient}=require('mongodb')
const {ObjectId}=require('mongodb')
const auth = require('./middleware/auth.ts')
const https = require('https');
const playersApiRequest = require('./middleware/playersApiRequest')
const cron=require('node-cron')
const postplayer=require('./middleware/postplayer')
const removePlayer = require('./middleware/removePlayer')
const updateRating = require('./middleware/updateRating')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const {fetchBootstrap,fetchEntryEvent,fetchFixtures}=require('fpl-api')
const getScores = require('./middleware/getScores')
const createleague = require('./middleware/createleague')
const loadleagues = require('./middleware/loadleagues')
const findleague = require('./middleware/findleague')
const joinleague = require('./middleware/joinleague')
const leaveleague = require('./middleware/leaveleague')
const news = require('./middleware/news')
const Loadnews = require('./middleware/loadnews')
const FixturesCheck = require('./middleware/FixturesCheck')
const currentfixturrapicheck = require('./middleware/CurrentFixtureApiCheck')
const currentfixture = require('./middleware/getcurrentfixture')
const test = require('./middleware/test')


app.post('/signup',async(req,res)=>{
const {email}=req.body;
const {password}=req.body;

const hashedpassword=await bcrypt.hash(req.body.password,10 )

const check=await db.collection('users').findOne({email:email})
if(check?.email) return res.status(401).send({error:'email already exists'})
const result = await db.collection('users').insertOne({
    email: email,
    password: hashedpassword,
  budget:550,
  points:0
  });
console.log(result)

  const payload={email:req.body.email}
const signed= jwt.sign(payload ,process.env.ACCESS_TOKEN, { expiresIn: '20m' })

const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN)
await db.collection('users').findOneAndUpdate({email:email},{$set:{refreshToken:refreshToken}} )
res.status(200).send({jwtToken:signed,refreshToken:refreshToken})
})

app.post('/auth',auth,async (req,res)=>{
console.log(req.body.email)
const dbcheck = await db.collection('users').findOne({ email: req.body.email });
console.log(dbcheck.password)
})

app.post('/login',async(req,res)=>{
//const finduser=user.email===req.body.email

const dbcheck = await db.collection('users').findOne({ email: req.body.email });
console.log(dbcheck)
if(dbcheck==null) return res.status(500).send('Email does not exist')
const match = await bcrypt.compare(req.body.password, dbcheck.password);
if (match){
  const payload={email:req.body.email}
 const signed=  jwt.sign(payload ,process.env.ACCESS_TOKEN)

 const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN,{ expiresIn: '30m' })
  await db.collection('users').findOneAndUpdate({email:req.body.email}, {$set: {refreshToken:refreshToken} })
  const dbrefresh=await db.collection('users').findOne({email:req.body.email})

    res.status(200).send({jwtToken:signed,refreshToken:dbrefresh.refreshToken})
}
else{     

  res.status(403).send({passstatuse:'wrong password or email'})

}
})

app.get('/',async (req,res)=>{
    // const {email}=req.body;
    // const data=await fetchFixtures(20)
    // console.log(data)
    const player=[]
  fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
  .then(res1=>res1.json())
  .then(data => {
    const footballers = data.elements.filter(element => element.element_type >= 2 && element.element_type <= 4);
    footballers.forEach((i)=>
    { 
      let players={
  totalPoints:i.total_points,
  averagePoints:i.points_per_game,
  firstname:i.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
  surname:i.second_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      }
player.push(players)
    })
    res.send(player);
  })
})
  
app.get('/loadplayers',auth,currentfixture,FixturesCheck,async (req,res)=>{
    const collection = db.collection('players');
    const {email}=req.body
    const {match}=req
    const {currentfixture}=req
    console.log('match',match)
    console.log('currentfixture',currentfixture)
    try {
      const doc = await collection.findOne({});
      if (!doc) { 
        return res.status(404).json({ message: 'No player data found' });
      }

      const playerArr = doc.players;
      res.status(200).json({ playerArr:playerArr,email:email,points:doc.points,fixtures:match,currentfixture:currentfixture });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving player data' });
    }

})


app.get('/getplayer',auth,async(req,res)=>{
    const email=req.email.email;
    const returnTeam =  await db.collection('users').findOne({email:email});
console.log(email)
    res.send({players:returnTeam.team,budget:returnTeam.budget,email:email,points:returnTeam.points })
    })
let db;
connectToDb((err)=>{

    if (err) return console.log(err)

    app.listen( process.env.PORT ,()=>{
        console.log('app is listening...')
    })
    db=getDb()
  app.delete('/removePlayer',auth,FixturesCheck,removePlayer)

    app.post('/postplayer',auth,FixturesCheck,postplayer)   
    
    app.get('/updateRating',updateRating)

    app.get('/getScores',getScores)

    app.post('/createleague',auth,createleague)
app.get('/loadleagues',auth,loadleagues)
app.get('/playersapirequest',playersApiRequest)
app.post('/findleague',auth,findleague)
app.post('/joinleague',auth,joinleague)
app.delete('/leaveleague',auth,leaveleague)
app.get('/Newnews',news)
app.get('/news',Loadnews)
app.get('/fixturescheck',FixturesCheck)
app.get('/currentfixtureapicheck',currentfixturrapicheck)
app.get('/currentfixture',currentfixture)
app.get('/test',test)
    cron.schedule('10 * * * *',()=>{
    getScores()
})
    cron.schedule('00 * * * *',()=>{
    FixturesCheck()
})
    cron.schedule('46 0 * * *',()=>{
    news()
})

    cron.schedule('50 0 * * *',()=>{
      currentfixtureapicheck()
})
})
