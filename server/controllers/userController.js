const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();
        res.json({ message: 'Profile updated', user: { _id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
