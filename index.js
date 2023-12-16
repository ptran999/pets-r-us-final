/*
 Title: index.js
 Date: 11/26/2023
 Author: Phuong Tran
 Description: Setup server
 Sources: https://github.com/buwebdev/web-340/blob/master/week-4/fms/index.js
*/

// Imports the Express framework
const express = require('express')
// Import the MongoDB framework
const mongoose = require('mongoose')
// Import the core module to read JSON file
const fs = require('fs');
// Import Customer.js
const Customer = require('./models/customer')
//Import Appointment.js
const Appointment = require('./models/appointment')
//Import the Services JSON
const servicesData = require('./public/data/services.json')
// Import the 'path' module 
const path = require('path')
// Create an instance of the app
const app = express()
// Set the port number 
const port = process.env.PORT || 3000
// Connect to MongoDB
//const conn = 'mongodb+srv://ptran999:Fashion999@customers.zz4f4yo.mongodb.net/?retryWrites=true&w=majority';
const conn = 'mongodb+srv://web340_admin:webstudent999@bellevueuniversity.bj68fz9.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(conn).then(() => {
    console.log('Connected to MongoDB!')
}).catch(err => {
    console.log('MongoDB Error: ' + err.message)
})

// Set views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')))

// connect to middleware 
app.use(express.urlencoded({ extended: true }))

//Define routs
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Pets-R-Us: Home',
        pageTitle: 'Landing Page'
    })
})

app.get('/grooming', (req, res) => {
    res.render('grooming', {
        title: 'Pets-R-Us: Grooming',
        pateTitle: 'Grooming'
    })
})

app.get('/boarding', (req, res) => {
    res.render('boarding', {
        title: "Pets-R-Us | Boarding",
        pageTitle: "Boarding"
    })
})

app.get('/training', (req, res) => {
    res.render('training', {
        title: "Pets-R-Us | Training",
        pageTitle: "Training" 
    })
})

app.get('/register', (req, res) => {
    res.render('register', {
        title: "Pets-R-Us | Register",
        pageTitle: "Register"
    })
})

app.get('/customer-list', (req, res) => {

    Customer.find().then(customers => {
        res.render('customer-list', {
            title: "Pets-R-Us | Customer List",
            pageTitle: "Customer List",
            customers: customers
        })
    }).catch(err => {
        res.status(500).send("Customer list failed to load." + err)
    }) 
})

app.get('/booking', (req, res) => {
   
    res.render('booking', {
        title: "Pets-R-Us | Booking",
        pageTitle: "Booking",
        services: servicesData
    });
});

app.get('/my-appointments', (req, res) => {
    //Render the 'my-appointments' view
    res.render('my-appointments', {
        title: "Pets-R-Us | My Appointments",
        pageTitle: "Appointments Info"
    });
});

app.get('/api/appointments/:email', async (req, res) => {
    try {
        //Get the userEmail from the req.params.email
        const userEmail = req.params.email
        //Find the the appointments with that email
        const appointments = await Appointment.find({ email: userEmail })
        //Respond to the client with the found appointment in JSON format
        res.json(appointments)
    } catch(err) {
        res.status(500).json({ error: "Appointment data failed to load.", details: err})
    }
})

app.post('/booking', async (req, res) => {
    try{
        //Create a new Appointment using the 'req.body' data
        const newAppointment = new Appointment(req.body)
        //Save the appointment
        await newAppointment.save()
        //Redirect to the appointment page
        res.redirect('/booking')
    } catch (err) {
        res.status(500).send('Booking failed. ' + err + req.body)
    }
});

app.post('/register', async (req, res) => {
    try {
        //Request the customerID and email
        const { customerID, email } = req.body
        //Create the new Customer
        const newCustomer = new Customer({ customerID, email });
        //Save the new customer to the database
        await newCustomer.save();
        //Render the register page 
        res.render('register', {
            title: "Pets-R-Us | Register",
            pageTitle: "Register",
            successMessage: "Registration successful!"
        })
    } catch (err) {
        res.status(500).send('Registration failed. ' + err + req.body)
    }
})

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`))