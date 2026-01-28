const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    // Kis Worker ko call kiya gaya
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    // Kisne call kiya (Customer)
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Call ka time
    calledAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);