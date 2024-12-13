const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

morgan.token('body', (req) => { 
    return req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '';
});

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${persons.length} people <br/> ${date}`);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const p = persons.find(person => person.id === id);
    if(p) {
        res.send(persons.find(person => person.id === id));   
    } else {
        res.status(404).json({ status: "404", message: "Person not found" });
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log(persons);
    const index = persons.findIndex(person => person.id === id);    
    if(index !== -1) {
        persons.splice(index, 1);
        res.status(204).end(); 
    } else {
        res.status(404).json({ status: "404", message: "Person not found" });
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const random = Math.floor(Math.random() * 1000000);
    const id = random.toString();

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'content missing'});
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({error: 'Name must be unique'});
    }

    const newPerson = {
        id: id,
        name: body.name,
        number: body.number,
    };
    
    persons.push(newPerson);
    res.json(newPerson);
})

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`); 
})