const mongoose = require('mongoose');



const animalSchema = mongoose.Schema({
    
    
    nombre: {
        type: String,
        required: true,
    },

    especie: {
        type: String,
        required: true,
    },

    raza: {
        type: String,
        required: true,
    },

    edad: {
        type: Number,
        required: true,
    }
})



module.exports = mongoose.model('animales', animalSchema)