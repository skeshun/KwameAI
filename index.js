const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./model/user');
const Note = require('./model/notes');
const port = process.env.PORT||3000;
const uri = "mongodb+srv://notesuser:2Vj22e7hstKYIXei@cluster0.8ltnyhz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri,  function (err) {
    if (err) {
        console.log(err);
        // prevent app from crashing

        process.exit(1);
    }
    console.log("Connected to MongoDB");
  
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => 
res.sendFile(__dirname + '/pages/index.html'));

app.get('/login', (req, res) =>
res.sendFile(__dirname + '/pages/login.html'));

app.get('/register', (req, res) => 
res.sendFile(__dirname + '/pages/signup.html'));



app.post('/login', async (req, res)  =>{
    const {userToken} = req.body;
    let user = await User.findOne(req.body)
    if (!user) return res.status(400).send('the user cannot be found!');
    else
    {
        res.status(200).json({success: true, user: {email:user.email}, message:"User Found"})
        console.log('user found');
    }
    });

app.post('/logout', async (req, res)  =>{
// log user out
let user = await User.findOne(req.body)
if(!user) return res.status(400).send('the user cannot be found!');
else
{
    res.status(200).json({success: true, user: {email:user.email}, message:"User Found"})
    console.log('user found');
} 
const {userToken} = req.body;

res.status(200).json({success: true, message:"User Logged Out"})
console.log('user logged out');
    })

app.post('/register', async (req, res)  =>{
    const {userToken} = req.body;
    //create user in db
    const user =  new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    await user.save();
    //if error, return error
    if (!user) return res.status(400).send('the user cannot be created!');
    //if no error, return user
    else 
    {
        console.log(user);
    }
    res.status(200).json({success: true, user: user})
});

app.post('/addnote', async (req, res)  =>{
    const {userToken} = req.body;
    let note = await Note.create(req.body);
    res.status(200).json({success: true, note: note})
    }
);

app.post('/deletenote', (req, res)  =>{
    const {userToken} = req.body;
    Note.findByIdAndDelete(req.body.id, function (err, note) {
        if (err) return res.status(400).send('the note cannot be found!');
        else
        {  
           // note.remove();
            res.status(200).json({success: true, message:"Note Deleted"})
        }
    }  
)
})
app.post('/getnotes', async (req, res)  =>{
   let notes = await Note.find({email: req.body.email});
    res.status(200).json({success: true, notes: notes})
    }  
);

// route to update a note
app.post('/updatenote', async (req, res)  =>{
    const {userToken} = req.body;
    let note = await Note.findByIdAndUpdate(req.body.id, req.body);
    res.status(200).json({success: true, note: note})
    }
);
 

app.listen(port, () => console.log(` app listening on port ${port}!`));