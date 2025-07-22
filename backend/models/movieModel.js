const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieName : {
        type: String,
        required : true,
    },
    movieGenre : {
        type : String,
        required : true,
    },
    movieRated: {
        type : String,
        required : true,
    },
    movieDetails : {
        type : String,
        required : true,
        maxLength : 500
    },
    moviePosterImage : {
        type : String,
        required : true,
    },
    movieDuration : {
        type: String,
        required: true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
});

const Movie = mongoose.model("movies", movieSchema);
module.exports = Movie;