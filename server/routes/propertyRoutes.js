const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/add', auth, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'verificationDocs', maxCount: 3 }]), propertyController.addProperty);
router.get('/all', propertyController.getAllProperties);
router.get('/my', auth, propertyController.getMyProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/update/:id', auth, propertyController.updateProperty);
router.delete('/delete/:id', auth, propertyController.deleteProperty);

module.exports = router;
