const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Usage: node mongo.js <password> [<name> <phone>]');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.lum75.mongodb.net/phonebookDB?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({})
        .then(result => {
            console.log('phonebook:');
            result.forEach(person => {
                console.log(`${person.name} ${person.phone}`);
            });
            mongoose.connection.close();
        })
        .catch(err => {
            console.error('Error fetching data:', err.message);
            mongoose.connection.close();
        });
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const phone = process.argv[4];

    const person = new Person({
        name: name,
        phone: phone,
    });

    person.save()
        .then(() => {
            console.log(`added ${name} number ${phone} to phonebook`);
            mongoose.connection.close();
        })
        .catch(err => {
            console.error('Error saving data:', err.message);
            mongoose.connection.close();
        });
} else {
    console.log('Invalid number of arguments. Usage: node mongo.js <password> [<name> <phone>]');
    mongoose.connection.close();
}
