const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {getRecommendation} = require('../controllers/houseControllers');


router.get('/getRecommend/:houseId', getRecommendation);

// router.get('/:houseId', async (req, res) => {
//     try {    
//         const response = await axios.get(
//             `http://localhost:8000/recommendation/recommend/${req.params.houseId}`
//         );
//         res.json(response.data.recommendations);
//     } catch (error) {
//         res.status(500).json({ 
//             error: error.response?.data?.detail || 'Recommendation failed' 
//         });
//     }
// });
module.exports = router;
