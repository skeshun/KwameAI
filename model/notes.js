const mongoose=require('mongoose');
const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    private:{
        type:Boolean
    }
    
});

module.exports=mongoose.model('Note',noteSchema);
