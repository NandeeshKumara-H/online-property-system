const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    district: { type: String, required: true },
    taluka: { type: String, required: true },
    hobli: { type: String },
    village: { type: String },
    address: { type: String, required: true },
    surveyNumber: { type: String },
    type: { type: String, required: true }, // Rent, Buy, PG, Commercial
    size: { type: Number },
    sizeUnit: { type: String, default: 'sq ft' },
    price: { type: Number, required: true },
    images: [{ type: String }],
    ownerName: { type: String },
    contactNumber: { type: String },
    verificationDocs: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
