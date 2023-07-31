// db.js
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/your-database-name';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Correct option name with a capital "C"
});

const db = mongoose.connection;

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Define your schemas and models here
// ...
