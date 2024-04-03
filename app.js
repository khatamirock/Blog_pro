//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotnv=require("dotenv");
const { MongoClient } = require("mongodb");


// imports>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



dotnv.config();

const post=require('./models/post');

var log_true=false;

// vars
const homeStartingContent = "Hello Welcome the the simple yet intersting Blog website .....  feel free to save ur post";
 
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

var pst_arr=[new post('super','man is the best'),new post('title001','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero cumque aut veniam modi, vitae voluptate eaque odit saepe dolore, voluptatibus fugit beatae magni cum nobis tempora dolores? Sint libero ducimus sequi itaque voluptatibus ipsam, quibusdam consequuntur rerum. Blanditiis quia autem eius explicabo! Laborum ex impedit sint cupiditate, repudiandae sapiente perspiciatis explicabo numquam qui maiores aperiam, fugiat, officia voluptatem provident quibusdam sit in. Quia aliquid quis eaque voluptates consectetur id minus, modi doloremque doloribus iste placeat error vero amet autem ab, ullam ipsa beatae. Quisquam ea harum recusandae fugit tenetur. Culpa natus, nihil, deleniti qui quisquam asperiores et delectus non porro possimus odio? Repudiandae harum quo maxime nihil praesentium. Natus at ad architecto eos. Dolores ipsum, consequuntur repudiandae beatae cum nostrum quis voluptates animi aspernatur incidunt veniam iure natus atque porro doloribus vitae. Adipisci eum omnis perspiciatis animi beatae ad porro numquam labore officia, velit dicta similique deleniti quam quis a aliquid neque nemo ullam nam soluta? Dolorem, aspernatur vitae impedit officia dolorum, ipsam cupiditate non nihil maxime, facilis at ipsa! Illum sed reprehenderit magnam saepe, autem quo, mollitia ab quisquam obcaecati tempore deserunt dicta, repellat expedita. Voluptatibus tenetur, laboriosam necessitatibus quidem magni labore temporibus eius voluptatum laborum? Voluptatum, laboriosam culpa?')];
// vars



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("assets"));



// commonConfigVars.>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
commonVars={logged:log_true}
// commonConfigVars.>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



var uid;
// Get HOME (root) page
app.get('/', function(req, res) {
  if(commonVars.logged){
  console.log(uid);
  res.render('home', {pageTitle: "Home", startingContent: homeStartingContent, posts: pst_arr, ...commonVars });
  }
  else{
    res.redirect('/logn');
  }
});

app.get('/about', function(req, res) {
  res.render('about', {pageTitle: "About",...commonVars });
});

app.get('/contact', function(req, res) {
  res.render('contact', {pageTitle: "Contact", startingContent: contactContent,...commonVars});
});

app.get('/posts/:post', function(req, res) {
  // console.log(req.params.post,' - fount it sir ??');
  pst_arr.forEach(element => {
    title=element.title;
    if(title==req.params.post){
      console.log('paic vaiii... match pauc');
      res.render('post',{pageTitle:title,post:element,...commonVars})
    }
    
  });
});

app.get('/compose', function(req, res) {
  res.render('compose', {...commonVars});
});


app.post('/compose', function(req, res) {
  // Use req(uest).body using body-parser module
  // console.log(req.body.pageTitle);
  const pot = new post(
    req.body.newTitle, req.body.newContent);

  pst_arr.push(pot);
  console.log(pst_arr);
  res.redirect('/');
});


app.get('/logn',function(req,res){
  if(!commonVars.logged){
  console.log(commonVars);
  res.render('login',{pageTitle:"LogIn",...commonVars});
  }
  res.redirect('/about');
})
app.post('/log_handl',async function(req,res){

  var name=req.body.uname;
  var pass=req.body.psw;
  console.log(name,pass);

  
    const uri =  process.env.MONG_URL;

    const client = new MongoClient(uri);

    var database;
    if(client){
      console.log("SUCCESS");
      database = client.db('blogUsers');
      
    }else{
      console.log("ERROR");
    }
    const allusers = database.collection('usercred');

    // Query for a movie that has the title 'Back to the Future'
    const query = { name:name,pass:pass};
    const got_user = await allusers.findOne(query);
 
 

    commonVars.logged=true;

    console.log(got_user);
    uid=1;
    var blogs = database.collection('blogs');
    var logs = await blogs.findOne({user:2});
    console.log(logs);


  res.redirect('/');

})



app.get('/signup',function(req,res){
  res.render('signup',{pageTitle:"SIGNUP", ...commonVars})
})


app.post('/signup', async function(req,res){
  var name=req.body.uname;
  var email=req.body.email;
  var pass=req.body.psw;

  console.log(name,email,pass);
  
  const uri =  process.env.MONG_URL;

  const client = new MongoClient(uri);
  var database;
  if(client){
    console.log("SUCCESS");
    database = client.db('blogUsers');
    
  }else{
    console.log("ERROR");
  }
  const allusers = database.collection('usercred');
  const lastUser = await allusers.find().sort({ _id: -1 }).limit(1).toArray();
  const newId = (lastUser.length === 0) ? 1 : lastUser[0]._id + 1;
  console.log(lastUser);

  const result = await allusers.insertOne({ _id: newId,email:email, name: name, pass: pass });
    console.log(`Added user with _id: ${newId}`);

  res.redirect('/lgin');

})


app.get('/logout',function(req,res){
  commonVars.logged=false;
  res.redirect('/');
})







app.listen(3000, function() {
  console.log("Successfully started server on port 3000");
});
