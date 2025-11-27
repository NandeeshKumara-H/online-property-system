const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./server/models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB Connected');

        const email = 'verifier@example.com';
        const password = 'password123';

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists, updating password...');
            user.password = password; // Model pre-save hook will hash this
            await user.save();
        } else {
            console.log('Creating new user...');
            user = new User({
                name: 'Verifier',
                email,
                password: password, // Model pre-save hook will hash this
                phone: '9999999999'
            });
            await user.save();
        }

        console.log('User ready: verifier@example.com / password123');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
