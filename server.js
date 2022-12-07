const express = require('express')
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const app = express()
const alert= require('alert');
const bcrypt = require("bcrypt");
const saltRounds = 10;
var tmph = "";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

  //RUN index.html IF APP RECEIVES A GET REQUEST
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/client.js', (req, res) => {
    res.sendFile(__dirname + '/client.js')
})
app.get('/server.js', (req, res) => {
    res.sendFile(__dirname + '/server.js')
})
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/notes.html')
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
app.use(limiter);

const mongoose = require('mongoose');
//mongoose.set('useFindAndModify', false);
const uri = "mongodb+srv://notesuser:2Vj22e7hstKYIXei@cluster0.8ltnyhz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Database Connection Established!')
})

const myFirstDatabase = mongoose.connection.useDb('myFirstDatabase');
//add to users collection in myFirstDatabase



app.post('/register',function(req,res){
    var tmp = req.body.remail;
    var tmp1 = req.body.rname;
    var tmp2 = req.body.rpassword;
    var tmp3 = req.body.rcpassword;

    console.log(tmp)  // stackoverflow0
    console.log(tmp1)  // stackoverflow1
    console.log(tmp2)  // stackoverflow1
    console.log(tmp3)  // stackoverflow1

    //add user to users collection
    const User = myFirstDatabase.model('users', {
        email: String,
        name: String,
        password: String,
     
    });
  
    if (!tmp || !tmp1 || !tmp2|| !tmp3) {
       alert("Please fill in all fields");
         console.log("Please fill in all fields");

        return;
    }
    if (tmp2 != tmp3) {
        alert("Passwords do not match");
        console.log("Passwords do not match");
        return;
    }
    else if (tmp2.length < 8) {
        alert("Password must be at least 8 characters");
        console.log("Password must be at least 8 characters");
        return;
    }
   
    
    console.log(tmph);

    // check if email already exists
    User.findOne({email: tmp
    }, function(err, user) {
        if (err) {
            alert("Email already exists");
            console.log(err);
            //redirect to login page
            return res.redirect('/')
        }
           
    });
    //hash password with bcrypt
    bcrypt.hash(tmp2, saltRounds, function(err, hash) {
        // Store hash in your password DB.
       // tmph = hash;
    
    var user = new User({
        email: tmp,
        name: tmp1,
        password: hash,
  
    });

    user.save(function(err){
        if(err){
            //display error on page with div id="error"
            const error= document.getElementById("error");
            error.innerHTML = "Error: " + err;

            console.log(err);
            return res.status(500).send();
        }
         return res.status(200).send();
        //redirect to notes page
        

    });


    return res.redirect('/notes')
    //res.send('success');
});
});


   //get posts from posts collection
   const Post = myFirstDatabase.model('posts', {
    title: String,
    body: String,
    date: String,

});
//display all notes in collection in string format
Post.find({}, (err, posts) => {
    console.log(posts)
    //display only the title of the notes
    posts.forEach(note => {
        console.log(note.title, note.body)
        
    }
    
    )
    if (err) {
        console.log(err);
        return res.status(500).send();
    }
    else{

     return   //  res.status(200).send();
    }
})
const notes = document.getElementById('product-select')
notes.innerHTML = posts;
app.get('/notes',function(req,res){
    //display posts in notes.html

 
});


app.listen(5000. , () => console.log('Server is running on port 5000'))