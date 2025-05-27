const express = require('express');
const { performMergeSort } = require('../controllers/sortController');

const router = express.Router();

router.post('/', (req, res) => {
  const { array } = req.body;
  const steps = performMergeSort(array);
  res.json({ steps });
});

module.exports = router;