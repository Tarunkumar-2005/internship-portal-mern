const express = require("express");
const mongoose = require("mongoose");
const bodyParser =  require("body-parser");
const dotenv = require("dotenv");
const Applicant  = require('./models/Applicant');
const ejsMate= require('ejs-mate');
const port=3000;
dotenv.config();
const app=express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("ejs",ejsMate);
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});
const mongo_url = process.env.MONGO_URI;
main()
.then(()=>{
    console.log("mongoDB connected");
})
.catch((err)=>{
    console.error("MongoDB Error: ",err);
});
async function main(){
    await mongoose.connect(mongo_url);
}

app.get('/', (req, res) => {
  res.render('home', { success: null });
});

app.get('/home', (req, res) => {
    const { success } = req.query;
    res.render('home', { success });
});

app.get('/register',(req,res)=>{
    res.render('register.ejs');
});

app.post('/home', async (req, res) => {
    const { name, email, phone, role, motivation } = req.body;
    try {
        await Applicant.create({ name, email, phone, role, motivation });
        res.redirect('/home?success=true');
    } catch (err) {
        res.status(500).send("Failed to Submit, Try Again.");
    }
});


app.get('/admin',(req,res)=>{
    res.render('adminLogin.ejs');
});

app.post('/admin',async(req,res)=>{
    const {password} =req.body;
    if(password === process.env.ADMIN_PASSWORD){
        try{
            const applicants= await Applicant.find().sort({_id:1}); //ascending
            res.render('admin_dashboard.ejs',{applicants});
            
        }catch(err){
            res.status(500).send("Failed to load applicants.");
        }
    }
    else{
        res.render('error');
    }
});




