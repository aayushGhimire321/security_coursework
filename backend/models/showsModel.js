const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    showPrice:{
        type:Number,
        required:true
    },
    seats:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'seats'
        }
    ]

}, {
    timestamps: true
});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
