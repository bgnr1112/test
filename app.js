import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs"; 
import {fileURLToPath}  from "url";
import {dirname} from "path";
import mongoose from "mongoose"; 
import encrypt from "mongoose-encryption";
const app=express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");
const usersSchema=new mongoose.Schema({
    email:String,
    password:String
});
console.log(process.env.API_KEY);
usersSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});
const User=mongoose.model("User", usersSchema)
app.get("/", (req, res)=>{
    res.render("home");
});
app.get("/login", (req, res)=>{
    res.render("login");
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.post("/login", (req, res)=>{
    User.findOne({email:req.body.username}).then(user=>{
        if (user!==null){
            if (req.body.password===user.password){
                console.log(user)
                res.render("secrets");
            }
        }
    }).catch(error=>{console.log(error)});
})
app.post("/register", (req, res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save().then(resolve=>{res.render("secrets")}).catch(error=>{console.log(error)});
});
app.listen(3000, ()=>{console.log("Server running on port 3000")});