const mongoose = require('mongoose');
const User = require('./server/models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB Connected');
        try {
            const res = await User.deleteMany({});
            console.log(`Deleted ${res.deletedCount} users.`);
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.log(err));
