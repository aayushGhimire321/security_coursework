const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNo:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:false
    },
    showId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Show'
    }
    
}, {
    timestamps: true
});

const Seat = mongoose.model('seats', seatSchema);

module.exports = Seat;
