
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {getDb}=require('../db')

async function getScores(req, res, next) {
    const db = getDb();
    const res1 = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    const data = await res1.json();
    const footballers = data.elements.filter(element => element.element_type >= 2 && element.element_type <= 4);
    const player = [];
    
    footballers.forEach((i) => { 
      let players = {
        totalPoints: i.total_points,
        firstname: i.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        surname: i.second_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        name: i.web_name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        nowcost: i.now_cost,
      };
      player.push(players);
    });
  
    const users = await db.collection('users').find().toArray();
    const po = await users.filter((i) => i.team !== undefined);


    po.map((i)=>{

      let checkscore=[i?.team?.gk ,i?.team?.rb ,i?.team?.rcb
        ,i?.team?.lcb ,i?.team?.lb ,i?.team?.rcm
        ,i?.team?.cm ,i?.team?.lcm ,i?.team?.rw
        ,i?.team?.st ,po?.team?.lw ]
        checkscore.map((j)=>{
          player.map((k)=>{
            if(j?.player?.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")===k.firstname &&
            j.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")===k.surname
            )
            {
              j.exists=true
            }
          })
          
        })        
         db.collection('users').findOneAndUpdate({email:i.email},{$set:{team:{ 
              [checkscore[0]?.position]:checkscore[0],
              [checkscore[1]?.position]:checkscore[1],
              [checkscore[2]?.position]:checkscore[2],
              [checkscore[3]?.position]:checkscore[3],
              [checkscore[4]?.position]:checkscore[4],
              [checkscore[5]?.position]:checkscore[5],
              [checkscore[6]?.position]:checkscore[6],
              [checkscore[7]?.position]:checkscore[7],
              [checkscore[8]?.position]:checkscore[8],
              [checkscore[9]?.position]:checkscore[9],
              [checkscore[10]?.position]:checkscore[10]
         } }})
      })



    po.forEach((j)=>{
        let count = 0;
        let score=0;
        let minus=0;
        player.map((i) => {
        if (

        i.firstname === j.team?.gk?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  && i.surname === j.team?.gk?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
       && j.team?.gk?.exists==true ||
        (i.firstname === j.team?.rb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.rb?.exists==true ||
        (i.firstname === j.team?.rcb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rcb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.rcb?.exists==true ||
        (i.firstname === j.team?.lcb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lcb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.lcb?.exists==true ||
        (i.firstname === j.team?.lb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.lb?.exists==true ||
        (i.firstname === j.team?.rcm?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rcm?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.rcm?.exists==true ||
        (i.firstname === j.team?.cm?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.cm?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.cm?.exists==true ||
        (i.firstname === j.team?.lcm?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lcm?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.lcm?.exists==true ||
        (i.firstname === j.team?.rw?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rw?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.rw?.exists==true ||
        ( i.firstname === j.team?.st?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.st?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) 
       && j.team?.st?.exists==true ||
        i.firstname === j.team?.lw?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lw?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
        {
     count+=i.nowcost;     
    }
    })
          if (j?.team?.gk?.exists === true) {
      score += j.team.gk.nowCost;
      }
      
      if (j?.team?.rb?.exists === true) {
      score += j.team.rb.nowCost;
      }
      
      if (j?.team?.lb?.exists === true) {
      score += j.team.lb.nowCost;
      }
      
      if (j?.team?.rcb?.exists === true) {
      score += j.team.rcb.nowCost;
      }
      
      if (j?.team?.lcb?.exists === true) {
      score += j.team.lcb.nowCost;
      }
      
      if (j?.team?.cm?.exists === true) {
      score += j.team.cm.nowCost;
      }
      
      if (j?.team?.rcm?.exists === true) {
      score += j.team.rcm.nowCost;
      }
      
      if (j?.team?.lcm?.exists === true) {
      score += j.team.lcm.nowCost;
      }
      
      if (j?.team?.st?.exists === true) {
      score += j.team.st.nowCost;
      }
      
      if (j?.team?.lw?.exists === true) {
      score += j.team.lw.nowCost;
      }
      
      if (j?.team?.rw?.exists === true) {
      score += j.team.rw.nowCost;
      console.log('count:',count,'score',score)
      
      }
      console.log(score)  
      j={
        ...j,
        points:count-score
      }
      if(j.points<0) { j.points=0}
     db.collection('users').findOneAndUpdate({email:j.email},{ $set:{points:j.points}})
})


}
module.exports=getScores;
