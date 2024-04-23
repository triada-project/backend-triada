const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events');

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/', eventController.post);
router.put('/:id', eventController.put);
router.delete('/:id', eventController.delete);

// router.get('/', (req, res) => {
//   res.status(200).send('Hola desde events');
// });

module.exports = router;
