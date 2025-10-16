const express = require('express');
const router = express.Router();
const NutritionData = require('../models/NutritionData');
const authenticateKey = require('../middleware/auth');

/**
 * @swagger
 * /api/health/nutrition:
 *   post:
 *     summary: Create a new nutrition data entry
 *     description: Store nutrition tracking data including calories, protein, fats, and carbs
 *     tags: [Health - Nutrition]
 *     security:
 *       - MasterKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalCalorie
 *               - totalProtien
 *             properties:
 *               totalCalorie:
 *                 type: number
 *                 minimum: 0
 *                 example: 2000
 *               totalProtien:
 *                 type: number
 *                 minimum: 0
 *                 example: 150
 *               totalFats:
 *                 type: number
 *                 minimum: 0
 *                 example: 60
 *               totalCarbs:
 *                 type: number
 *                 minimum: 0
 *                 example: 250
 *     responses:
 *       201:
 *         description: Nutrition data stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Nutrition data stored successfully
 *                 data:
 *                   $ref: '#/components/schemas/NutritionData'
 *       400:
 *         description: Bad request - Missing required fields
 *       401:
 *         description: Unauthorized - No master key provided
 *       403:
 *         description: Forbidden - Invalid master key
 *       500:
 *         description: Internal server error
 */
router.post('/nutrition', authenticateKey, async (req, res) => {
  try {
    const { totalCalorie, totalProtien, totalFats, totalCarbs } = req.body;

    // Validate required fields
    if (totalCalorie === undefined || totalCalorie === null) {
      return res.status(400).json({
        success: false,
        message: 'totalCalorie is required'
      });
    }

    if (totalProtien === undefined || totalProtien === null) {
      return res.status(400).json({
        success: false,
        message: 'totalProtien is required'
      });
    }

    // Create new nutrition entry
    const nutritionData = new NutritionData({
      totalCalorie,
      totalProtien,
      totalFats: totalFats || null,
      totalCarbs: totalCarbs || null
    });

    await nutritionData.save();

    res.status(201).json({
      success: true,
      message: 'Nutrition data stored successfully',
      data: nutritionData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error storing nutrition data',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/health/nutrition:
 *   get:
 *     summary: Get all nutrition data entries
 *     description: Retrieve all stored nutrition tracking data, sorted by most recent first
 *     tags: [Health - Nutrition]
 *     security:
 *       - MasterKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved nutrition data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NutritionData'
 *       401:
 *         description: Unauthorized - No master key provided
 *       403:
 *         description: Forbidden - Invalid master key
 *       500:
 *         description: Internal server error
 */
router.get('/nutrition', authenticateKey, async (req, res) => {
  try {
    const nutritionData = await NutritionData.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: nutritionData.length,
      data: nutritionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrition data',
      error: error.message
    });
  }
});

module.exports = router;
