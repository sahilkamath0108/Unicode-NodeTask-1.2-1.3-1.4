const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));



//connecting to moongoose

mongoose.connect("mongodb+srv://spectre:spectre@cluster0.lgogv37.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection
db.once('open', () => {
  console.log('Database connected')
})

db.on('error', err => {
  console.error('connection error:')
})

const Schema = mongoose.Schema


//creating schema
const charSchema = new Schema({
  char_id: Number,
  name: String,
  status: String,
  nickname: String,
  portrayed: String,
  category: String,
  img: String,
  occupation:[],
  birthday: String,
})

module.exports = mongoose.model('favchars', charSchema);
const favChar = mongoose.model('favchars', charSchema);





app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");

  async function characters(){
    const url = 'https://breakingbadapi.com/api/characters';
    let chars = await fetch(url);

    return chars.json();
  }

  characters()
  .then((response)=>console.log(response));
})

app.post("/", function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const toBeRemovedf = req.body.killfname;
  const toBeRemovedl = req.body.killlname;

  //   async function dblist(){
  //   let dbchar= await fetch("https://breakingbadapi.com/api/characters?name="+firstName+"+"+lastName);
  //   return dbchar.json();
  // }
  // dblist()
  // .then(resp => {return resp})
  // .then((data) => console.log(data))
  // .catch((err)=> console.error(err));

//ADD fav character
    async function charInfo(){
    let info = await fetch("https://breakingbadapi.com/api/characters?name="+firstName+"+"+lastName);
    return info.json();
    }
    charInfo()
    .then(function(data){

      console.log("Favorite character is: ");
      console.log(data);

      const fav = new favChar({
        char_id: data[0].char_id,
        name: data[0].name,
        status: data[0].status,
        nickname: data[0].nickname,
        portrayed: data[0].portrayed,
        img: data[0].img,
        category: data[0].category,
        occupation: data[0].occupation,
        birthday: data[0].birthday,

      });

          fav.save();

      const name = data[0].name;
      const bday = data[0].birthday;
      const occ = data[0].occupation;;
      const status = data[0].status;
      const nickName = data[0].nickname;
      const app = data[0].appearance;
      const actor = data[0].portrayed;
      const showBB = data[0].category;
      const showBCS = data[0].better_call_saul_appearance;
      const img = data[0].img;

      res.write("<h1><b>The name is "+name+".</b></h1>");
      res.write("<img src="+img+">");
      res.write("<h3>Born on: "+bday+"</h3>");
      res.write("<h3>Occupation: "+occ+"</h3>");
      res.write("<h3>Status: "+status+"</h3>");
      res.write("<h3>Nickname: "+nickName+"</h3>");
      res.write("<h3>Appeared in seasons: "+app+"</h3>");
      res.write("<h3>Portrayed by: "+actor+"</h3>");
      res.write("<h3>Category: "+showBB+"</h3>");
      res.write("<h3>Appearance in BCS: "+showBCS+"</h3>");



      // Delete character
      fetch("https://breakingbadapi.com/api/characters?name="+toBeRemovedf+"+"+toBeRemovedl)
      .then(resp => {
        return resp.json();
      })
      .then(data => {

        if(toBeRemovedf==="none"){
          console.log("No one died");
        }else{
        console.log("Deleted character: ");
        const id = data[0].char_id;
        favChar.findOneAndDelete({char_id: id}, (err, docs)=>{
            if (!err){
               console.log( docs);
            }
            else{
               console.log(err);
            }
          });
        }
      })







    })
    .catch(err => {
      console.error(err);
    });

})




//Breaking Bad

// async function characters(){
//   const url = 'https://breakingbadapi.com/api/characters?category=Breaking+Bad';
//   let chars = await fetch(url);
//
//   return chars.json();
// }

//Better Call Saul

// async function characters(){
//   const url = 'https://breakingbadapi.com/api/characters?category=Better+Call+Saul';
//   let chars = await fetch(url);
//
//   return chars.json();
// }

// characters()
// .then((response)=> console.log(response));










//process.env.PORT
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is fine");
})
