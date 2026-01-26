const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name: {type:String, required:true},
    phone: {type:String, required:true, unique:true},
    role:{
        type:String,
        enum:['normal','freelancer','company','student','mentor','admin'],
        default:'normal'
    },
    location:{
        type:{type: String ,enum:['Point'], default:false},
        coordinates:{type: [Number],required:true}
    },
    verified:{type: Number,default:false},
    skills:[String],
    walletBalance:{type: Number, default:0}
},{timestamps:true})

userSchema.index({location:"2dsphere"})
module.exports=mongoose.model('User',userSchema);