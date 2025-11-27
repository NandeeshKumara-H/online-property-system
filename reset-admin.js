const mongoose = require('mongoose');
const Admin = require('./server/models/Admin');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB Connected');
        try {
            // Delete existing if any
            await Admin.deleteOne({ username: 'admin' });

            // Create new
            const newAdmin = new Admin({ username: 'admin', password: 'admin' });
            await newAdmin.save();

            console.log('Admin user created successfully: admin / admin');
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.log(err));
