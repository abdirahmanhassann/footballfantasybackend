
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
    po.forEach((j)=>{
        let count = 0;
        let score=0;
        player.map((i) => {
        if (
        (i.firstname === j.team?.gk?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.gk?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.rb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.rcb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rcb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.lcb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lcb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.lb?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lb?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.rcm?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rcm?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.cm?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.cm?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.lcm?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lcm?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        (i.firstname === j.team?.rw?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.rw?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        ( i.firstname === j.team?.st?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.st?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        ( i.firstname === j.team?.lw?.player.firstname.normalize("NFD").replace(/[\u0300-\u036f]/g, "") && i.surname === j.team?.lw?.player.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
        {

             score=(j.team?.gk?.nowCost ?? 0) +
             (j.team?.rb?.nowCost ?? 0) +
             (j.team?.lb?.nowCost ?? 0) +
             (j.team?.lcb?.nowCost ?? 0) +
             (j.team?.rcb?.nowCost ?? 0) +
             (j.team?.cm?.nowCost ?? 0) +
             (j.team?.rcm?.nowCost ?? 0) +
             (j.team?.lcm?.nowCost ?? 0) +
             (j.team?.st?.nowCost ?? 0) +
             (j.team?.lw?.nowCost ?? 0) +
             (j.team?.rw?.nowCost ?? 0)
             ;
            
     count+=i.nowcost;
        }
    })
    
    j={
        ...j,
        points:count-score
    }
    console.log(j.points)
     db.collection('users').findOneAndUpdate({email:j.email},{ $set:{points:j.points}})
})


}
module.exports=getScores;