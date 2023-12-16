/*
 Title: customer.js
 Date: 11/24/2023
 Author: Phuong Tran
 Description: Setup customer mongoose model
 Sources:   https://mongoosejs.com/docs/models.html 
            https://www.youtube.com/watch?v=MYdGwi1glko 
*/

//Import the MongoDB framework
const mongoose = require('mongoose');
//Create the customerSchema
const customerSchema = new mongoose.Schema({
    customerID: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
})

//Export module
module.exports = mongoose.model('Customer', customerSchema);