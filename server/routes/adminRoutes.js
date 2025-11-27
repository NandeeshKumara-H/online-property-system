const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

router.get('/properties/pending', auth, isAdmin, adminController.getPendingProperties);
router.put('/property/approve/:id', auth, isAdmin, adminController.approveProperty);
router.delete('/property/delete/:id', auth, isAdmin, adminController.deleteProperty);
router.get('/users', auth, isAdmin, adminController.getAllUsers);

module.exports = router;
