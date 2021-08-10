const mongoose = required('mongoose')
const UserSchema = new mongoose.Schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
    created_at:{type:date,default:Date.now()},
})

module.exports = mongoose.model("user",UserSchema)
