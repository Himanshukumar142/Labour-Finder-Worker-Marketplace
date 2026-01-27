const mongoose=require('mongoose')

const workerSchema=new mongoose.Schema({
    name:{type:String, required:true},
    category: {type: String, required:true},
    phone: {type: String, required:true, unique:true},
    experience:{type: String},
    dailyWage:{type: Number},
    location: {
        type:{type: String, default:'Point'},

    },
    addedBy:{type:mongoose.Schema.Types.ObjectId, ref:'Agent'}
},{timestamps:true});

workerSchema.index({location:"2dsphere"})
module.exports=mongoose.model('Worker',workerSchema);