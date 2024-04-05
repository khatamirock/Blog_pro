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
const { connectToDatabase } = require("./models/collections");




// vars
const homeStartingContent = "Hello Welcome the the simple yet intersting Blog website .....  feel free to share your post";
 
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// var pst_arr=[new post('super','man is the best'),new post('title001','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero cumque aut veniam modi, vitae voluptate eaque odit saepe dolore, voluptatibus fugit beatae magni cum nobis tempora dolores? Sint libero ducimus sequi itaque voluptatibus ipsam, quibusdam consequuntur rerum. Blanditiis quia autem eius explicabo! Laborum ex impedit sint cupiditate, repudiandae sapiente perspiciatis explicabo numquam qui maiores aperiam, fugiat, officia voluptatem provident quibusdam sit in. Quia aliquid quis eaque voluptates consectetur id minus, modi doloremque doloribus iste placeat error vero amet autem ab, ullam ipsa beatae. Quisquam ea harum recusandae fugit tenetur. Culpa natus, nihil, deleniti qui quisquam asperiores et delectus non porro possimus odio? Repudiandae harum quo maxime nihil praesentium. Natus at ad architecto eos. Dolores ipsum, consequuntur repudiandae beatae cum nostrum quis voluptates animi aspernatur incidunt veniam iure natus atque porro doloribus vitae. Adipisci eum omnis perspiciatis animi beatae ad porro numquam labore officia, velit dicta similique deleniti quam quis a aliquid neque nemo ullam nam soluta? Dolorem, aspernatur vitae impedit officia dolorum, ipsam cupiditate non nihil maxime, facilis at ipsa! Illum sed reprehenderit magnam saepe, autem quo, mollitia ab quisquam obcaecati tempore deserunt dicta, repellat expedita. Voluptatibus tenetur, laboriosam necessitatibus quidem magni labore temporibus eius voluptatum laborum? Voluptatum, laboriosam culpa?')];
// vars
var pst_arr=[];


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("assets"));
app.use(express.static("models"));


var log_true=false;
// commonConfigVars.>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
commonVars={logged:log_true,name:"none",uid:-1,react:[]}
// commonConfigVars.>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



// Middleware to parse JSON bodies
app.use(express.json()); // this line is suffice
 
// end >>>>>>>>>>>>>>>>>>>>>>>>

var uid;
// Get HOME (root) page
app.get('/', function(req, res) {
  if(commonVars.logged){
  
  res.render('home', {pageTitle: "Hello - ", posts: pst_arr, ...commonVars });
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

  if(commonVars.logged){
  res.render('compose', {...commonVars});
  }
  else{
    res.redirect('/logn');
  }
});


app.post('/compose', async function(req, res) {
  // Use req(uest).body using body-parser module
  // console.log(req.body.pageTitle);
  if(commonVars.logged){

    var title=req.body.newTitle;
    var cont=req.body.newContent
  const pot = new post(
    commonVars.name,
    title,cont );

    console.log(commonVars);
    var database;
    var blogs;
    try{
       database = await connectToDatabase(); 
      blogs = database.collection('blogs');
     }
     catch(e){
      console.log("ERRRRROORR",e);
     }
     
    const result = await blogs.insertOne({title:pot.title, content: pot.content,user:commonVars.uid,react:[]});


  pst_arr.push(pot);
  res.redirect('/');

  }else{
    res.redirect('/logn');
  }

  
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
  var got_user;
  var database;
  var blogs;
   try{
    database = await connectToDatabase();
    const allusers = database.collection('usercred');
    blogs = database.collection('blogs');

  
    const query = { name:name,pass:pass};
    got_user = await allusers.findOne(query);
 
   }
   catch(e){
    console.log("ERRRRROORR",e);
   }

    var lss=[];
    pst_arr=[];




    if(got_user){
    commonVars.logged=true;
    commonVars.name=got_user.name;
    theId=got_user._id;
    commonVars.uid=theId;
 


    console.log(theId);
     
    
    var lsts=blogs.find({"user":theId})
    lsts=await lsts.toArray();
    console.log(lsts,"\n\n>>>>>>>>>>",lsts.length);
 
    lsts.forEach(elm => {
      var cont=elm.content;
      var title=elm.title;
      console.log(elm.react);
 
      pst_arr.push(new post(got_user.name,title,cont,elm.react));

      

    });

    // console.log("\n\n\n>>>>>>>>>>>>",lss);
    
    }

    
    

  // res.redirect('/logn');
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


var mineorother='mine';

app.post('/testr',async function(req,res){
  var blogType=req.body.idx;

  
 
  var database;
  var blogs;
  
  try{
   database = await connectToDatabase();

   blogs = database.collection('blogs');

  }
  catch(e){
   console.log("ERRRRROORR",e);
  }
  var qry={}
  if(blogType==="mine" && mineorother!==blogType){
    // console.log("amar",commonVars.uid);
    pst_arr=[]
    var id=commonVars.uid;
    var lsts=blogs.find({"user":id})
    var lsts=await lsts.toArray();
    // console.log(lsts);

    commonVars.logged=true;
    // commonVars.name=got_user.name;
    theId=id;
    qry['user']=id;
    commonVars.uid=id;

    mineorother="mine";
    
    
    
  }


  if(blogType==="others" && mineorother!==blogType)
  {
    pst_arr=[];
    console.log("sokoler");
    mineorother="other";
  }
    var lsts=blogs.find(qry);
    lsts=await lsts.toArray();
    
    
    const allusers = database.collection('usercred');

    // Iterate over the elements in lsts array using for...of loop
    for (const elm of lsts) {
      try {
        const cont = elm.content;
        const title = elm.title;
        const curid = elm.user;
    
        // Find the user by _id asynchronously
        const user = await allusers.findOne({ _id: curid });
    
        if (user) {
          const id = user.name;
          console.log(elm.user, id);
          pst_arr.push(new post(id, title, cont, elm.react));
        } else {
          console.log("User not found for _id:", curid);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    
  
  console.log("DONE LOADING >>>> from server");
  res.redirect('/')

})









app.listen(3000, function() {
  console.log("Successfully started server on port 3000");
});
