const mongoose=require("mongoose");

const applicantShcema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    role:String,
    motivation:String,
    ceatedAt:{
        type:Date,
        default:Date.now,
    },
});

module.exports = mongoose.model("Applicant",applicantShcema);