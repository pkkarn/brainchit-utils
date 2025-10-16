const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  totalCalorie: {
    type: Number,
    required: [true, 'Total calories is required'],
    min: [0, 'Calories cannot be negative']
  },
  totalProtien: {
    type: Number,
    required: [true, 'Total protein is required'],
    min: [0, 'Protein cannot be negative']
  },
  totalFats: {
    type: Number,
    required: false,
    min: [0, 'Fats cannot be negative'],
    default: null
  },
  totalCarbs: {
    type: Number,
    required: false,
    min: [0, 'Carbs cannot be negative'],
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NutritionData', nutritionSchema);
