require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3001

// --- Middleware ---

app.use(express.json())      // parse incoming JSON request bodies
app.use(cors())              // allow cross-origin requests (needed by the frontend)
app.use(express.static('dist')) // serve the built React frontend

// Custom Morgan token that logs the request body for POST requests
morgan.token('body', (req) => {
    return req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// --- Database ---

mongoose.connect(process.env.MONGODB_URI)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
})

// Transform the returned object: rename _id to id and remove __v
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

// --- Routes ---

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

// Get all persons from the database
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})

// Show how many entries are in the phonebook and the current date
app.get('/info', (req, res) => {
    Person.countDocuments({}).then(count => {
        res.send(`Phonebook has info for ${count} people <br/> ${new Date()}`)
    })
})

// Get a single person by id
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Delete a person by id
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// Add a new person
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error))
})

// Update a person's number by id
app.put('/api/persons/:id', (req, res, next) => {
    const { number } = req.body

    if (!number) {
        return res.status(400).json({ error: 'Number is missing' })
    }

    Person.findByIdAndUpdate(
        req.params.id,
        { number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (!updatedPerson) {
                return res.status(404).end()
            }
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Catches any request that didn't match a defined route
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// --- Error handler ---
// Must be the last middleware, after all routes
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})
