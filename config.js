const mongoose = require('mongoose');

// Replace <username>, <password>, and <dbname> with your actual MongoDB Atlas credentials and database name
const uri = 'mongodb+srv://karthik:Karthik%400756@cluster0.zxheq.mongodb.net/Atlas';

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));