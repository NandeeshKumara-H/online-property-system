const Property = require('../models/Property');

exports.addProperty = async (req, res) => {
    try {
        const {
            title, description, price, district, taluka, hobli, village,
            address, surveyNumber, type, size, sizeUnit, ownerName, contactNumber
        } = req.body;

        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const verificationDocs = req.files['verificationDocs'] ? req.files['verificationDocs'].map(file => file.path) : [];

        const property = new Property({
            title,
            description,
            price,
            district,
            taluka,
            hobli,
            village,
            address,
            surveyNumber,
            type,
            size,
            sizeUnit,
            ownerName,
            contactNumber,
            images,
            verificationDocs,
            owner: req.user._id
        });

        await property.save();
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const { city, type, budget } = req.query;
        let query = { status: 'approved' };

        if (city) query.city = new RegExp(city, 'i');
        if (type) query.type = type;
        if (budget) query.price = { $lte: budget };

        const properties = await Property.find(query).populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(property, req.body);
        await property.save();
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await property.deleteOne();
        res.json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user._id });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
