//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const post=require('./models/post');



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

var parr=[new post('super','man is the best'),new post('title001','Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero cumque aut veniam modi, vitae voluptate eaque odit saepe dolore, voluptatibus fugit beatae magni cum nobis tempora dolores? Sint libero ducimus sequi itaque voluptatibus ipsam, quibusdam consequuntur rerum. Blanditiis quia autem eius explicabo! Laborum ex impedit sint cupiditate, repudiandae sapiente perspiciatis explicabo numquam qui maiores aperiam, fugiat, officia voluptatem provident quibusdam sit in. Quia aliquid quis eaque voluptates consectetur id minus, modi doloremque doloribus iste placeat error vero amet autem ab, ullam ipsa beatae. Quisquam ea harum recusandae fugit tenetur. Culpa natus, nihil, deleniti qui quisquam asperiores et delectus non porro possimus odio? Repudiandae harum quo maxime nihil praesentium. Natus at ad architecto eos. Dolores ipsum, consequuntur repudiandae beatae cum nostrum quis voluptates animi aspernatur incidunt veniam iure natus atque porro doloribus vitae. Adipisci eum omnis perspiciatis animi beatae ad porro numquam labore officia, velit dicta similique deleniti quam quis a aliquid neque nemo ullam nam soluta? Dolorem, aspernatur vitae impedit officia dolorum, ipsam cupiditate non nihil maxime, facilis at ipsa! Illum sed reprehenderit magnam saepe, autem quo, mollitia ab quisquam obcaecati tempore deserunt dicta, repellat expedita. Voluptatibus tenetur, laboriosam necessitatibus quidem magni labore temporibus eius voluptatum laborum? Voluptatum, laboriosam culpa?')];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Get HOME (root) page
app.get('/', function(req, res) {
  
  res.render('home', {pageTitle: "Home", startingContent: homeStartingContent, posts: parr });
});

app.get('/about', function(req, res) {
  res.render('about', {pageTitle: "About", startingContent: aboutContent});
});

app.get('/contact', function(req, res) {
  res.render('contact', {pageTitle: "Contact", startingContent: contactContent});
});

app.get('/posts/:post', function(req, res) {
  // console.log(req.params.post,' - fount it sir ??');
  parr.forEach(element => {
    title=element.title;
    if(title==req.params.post){
      console.log('paic vaiii... match pauc');
      res.render('post',{pageTitle:title,post:element})
    }
    
  });
});

app.get('/compose', function(req, res) {
  res.render('compose', {});
});

app.post('/compose', function(req, res) {
  // Use req(uest).body using body-parser module
  console.log(req.body.pageTitle);
  const pot = new post(
    req.body.newTitle, req.body.newContent);

  parr.push(pot);
  console.log(parr);
  res.redirect('/');
});









app.listen(3000, function() {
  console.log("Successfully started server on port 3000");
});
