const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    category: { 
    type: [String], 
    required: [true, 'Please specify the work category'], 
    enum: [
        'Plumber', 
        'Electrician', 
        'Labor', 
        'Painter', 
        'Mason', 
        'Carpenter', 
        'Welder', 
        'Tiles Fitting', 
        'POP Work', 
        'Cleaning', 
        'Gardener', 
        'Driver', 
        'Other'
    ] 
},
    dailyWage: { type: Number, required: true },
    location: {
        type: { type: String, default: 'Point' }, // Type hamesha 'Point' rahega
        coordinates: { type: [Number], required: true }, // [Longitude, Latitude]
        address: { type: String } // Pata dikhane ke liye (e.g., "Sec 62, Noida")
    },
    // Kis Agent ne add kiya
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
workerSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Worker', workerSchema);