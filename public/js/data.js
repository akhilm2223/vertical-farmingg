/**
 * Climate zone definitions with temperature and humidity ranges
 * and crops that grow well in each zone
 */
const climateZones = {
  'tropical': { 
    temp: [20, 35], 
    humidity: [60, 100], 
    crops: ['Basil', 'Kale', 'Mint', 'Spinach', 'Lettuce', 'Cherry Tomatoes', 'Microgreens', 'Cilantro'] 
  },
  'arid': { 
    temp: [25, 45], 
    humidity: [10, 30], 
    crops: ['Rosemary', 'Thyme', 'Sage', 'Cherry Tomatoes', 'Bell Peppers', 'Microgreens', 'Mint'] 
  },
  'temperate': { 
    temp: [10, 25], 
    humidity: [40, 70], 
    crops: ['Strawberries', 'Lettuce', 'Spinach', 'Kale', 'Basil', 'Cilantro', 'Microgreens', 'Arugula'] 
  },
  'cold': { 
    temp: [-10, 10], 
    humidity: [30, 70], 
    crops: ['Kale', 'Spinach', 'Lettuce', 'Microgreens', 'Mint', 'Chard', 'Parsley'] 
  }
};

/**
 * Detailed crop data including water, light, seed, and nutrient requirements
 */
const cropData = {
  'Basil': {
    water: { daily: 0.5, method: 'drip' },
    seeds: { per_sqm: 40, depth: 0.6 },
    light: { daily: 6, lux: 15000 },
    nutrients: ['N-P-K 3-1-2', 'Calcium'],
    lightRequirements: { artificial: true },
    harvestTime: 28
  },
  'Lettuce': {
    water: { daily: 0.8, method: 'spray' },
    seeds: { per_sqm: 25, depth: 0.3 },
    light: { daily: 8, lux: 12000 },
    nutrients: ['N-P-K 4-2-3', 'Iron', 'Calcium'],
    lightRequirements: { artificial: true },
    harvestTime: 35
  },
  'Spinach': {
    water: { daily: 0.7, method: 'drip' },
    seeds: { per_sqm: 30, depth: 0.5 },
    light: { daily: 5, lux: 10000 },
    nutrients: ['N-P-K 4-1-2', 'Iron', 'Magnesium'],
    lightRequirements: { artificial: true },
    harvestTime: 40
  },
  'Kale': {
    water: { daily: 0.6, method: 'drip' },
    seeds: { per_sqm: 20, depth: 0.5 },
    light: { daily: 7, lux: 14000 },
    nutrients: ['N-P-K 5-3-3', 'Calcium', 'Magnesium'],
    lightRequirements: { artificial: true },
    harvestTime: 50
  },
  'Mint': {
    water: { daily: 0.6, method: 'spray' },
    seeds: { per_sqm: 15, depth: 0.2 },
    light: { daily: 5, lux: 10000 },
    nutrients: ['N-P-K 3-1-2', 'Iron'],
    lightRequirements: { artificial: true },
    harvestTime: 30
  },
  'Strawberries': {
    water: { daily: 0.9, method: 'drip' },
    seeds: { per_sqm: 8, depth: 0.5 },
    light: { daily: 10, lux: 20000 },
    nutrients: ['N-P-K 2-3-6', 'Calcium', 'Magnesium'],
    lightRequirements: { artificial: true },
    harvestTime: 60
  },
  'Cherry Tomatoes': {
    water: { daily: 1.0, method: 'drip' },
    seeds: { per_sqm: 5, depth: 1.0 },
    light: { daily: 12, lux: 25000 },
    nutrients: ['N-P-K 5-10-10', 'Calcium', 'Magnesium', 'Sulfur'],
    lightRequirements: { artificial: false },
    harvestTime: 75
  },
  'Bell Peppers': {
    water: { daily: 0.9, method: 'drip' },
    seeds: { per_sqm: 6, depth: 0.8 },
    light: { daily: 12, lux: 22000 },
    nutrients: ['N-P-K 5-10-10', 'Calcium', 'Magnesium'],
    lightRequirements: { artificial: false },
    harvestTime: 80
  },
  'Microgreens': {
    water: { daily: 0.5, method: 'spray' },
    seeds: { per_sqm: 150, depth: 0.1 },
    light: { daily: 6, lux: 10000 },
    nutrients: ['N-P-K 2-1-2', 'Trace minerals'],
    lightRequirements: { artificial: true },
    harvestTime: 14
  },
  'Cilantro': {
    water: { daily: 0.6, method: 'spray' },
    seeds: { per_sqm: 40, depth: 0.3 },
    light: { daily: 6, lux: 12000 },
    nutrients: ['N-P-K 3-1-2', 'Calcium'],
    lightRequirements: { artificial: true },
    harvestTime: 25
  },
  'Arugula': {
    water: { daily: 0.7, method: 'spray' },
    seeds: { per_sqm: 30, depth: 0.3 },
    light: { daily: 6, lux: 12000 },
    nutrients: ['N-P-K 3-1-3', 'Iron', 'Calcium'],
    lightRequirements: { artificial: true },
    harvestTime: 30
  },
  'Rosemary': {
    water: { daily: 0.4, method: 'drip' },
    seeds: { per_sqm: 10, depth: 0.3 },
    light: { daily: 8, lux: 18000 },
    nutrients: ['N-P-K 2-2-2', 'Calcium'],
    lightRequirements: { artificial: true },
    harvestTime: 90
  },
  'Thyme': {
    water: { daily: 0.3, method: 'drip' },
    seeds: { per_sqm: 15, depth: 0.2 },
    light: { daily: 7, lux: 16000 },
    nutrients: ['N-P-K 2-2-2', 'Iron'],
    lightRequirements: { artificial: true },
    harvestTime: 60
  },
  'Sage': {
    water: { daily: 0.4, method: 'drip' },
    seeds: { per_sqm: 10, depth: 0.3 },
    light: { daily: 7, lux: 16000 },
    nutrients: ['N-P-K 3-1-2', 'Calcium'],
    lightRequirements: { artificial: true },
    harvestTime: 75
  },
  'Chard': {
    water: { daily: 0.8, method: 'drip' },
    seeds: { per_sqm: 20, depth: 0.5 },
    light: { daily: 6, lux: 12000 },
    nutrients: ['N-P-K 4-3-3', 'Iron', 'Magnesium'],
    lightRequirements: { artificial: true },
    harvestTime: 45
  },
  'Parsley': {
    water: { daily: 0.6, method: 'spray' },
    seeds: { per_sqm: 35, depth: 0.3 },
    light: { daily: 5, lux: 12000 },
    nutrients: ['N-P-K 3-1-2', 'Iron'],
    lightRequirements: { artificial: true },
    harvestTime: 40
  }
}; 