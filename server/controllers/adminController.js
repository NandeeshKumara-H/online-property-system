const Property = require('../models/Property');
const User = require('../models/User');

exports.getPendingProperties = async (req, res) => {
    try {
        const properties = await Property.find({ status: 'pending' }).populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.approveProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        property.status = 'approved';
        await property.save();
        res.json({ message: 'Property approved', property });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        await property.deleteOne();
        res.json({ message: 'Property rejected/deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
