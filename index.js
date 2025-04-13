const inquirer = require('inquirer');
const axios = require('axios');
const colors = require('colors');
const { climateZones, cropData } = require('./data');

// Format console output with colors
colors.setTheme({
  title: ['cyan', 'bold'],
  subtitle: ['green', 'bold'],
  info: 'white',
  highlight: 'yellow',
  data: 'cyan',
  success: 'green',
  error: 'red',
  warning: 'yellow'
});

/**
 * Main function to start the vertical farming assistant
 */
async function startVerticalFarmAssistant() {
  console.log('\n=== VERTICAL FARMING ASSISTANT ==='.title);
  console.log('Get personalized guidance for your vertical farm setup'.info);
  
  try {
    // Get user input about environment
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'location',
        message: 'Enter your location (city/country):',
        validate: input => input.trim() ? true : 'Location is required'
      },
      {
        type: 'number',
        name: 'avgTemp',
        message: 'Enter average temperature (°C):',
        validate: input => (input > -50 && input < 60) ? true : 'Temperature must be between -50°C and 60°C'
      },
      {
        type: 'number',
        name: 'humidity',
        message: 'Enter average humidity (%):',
        validate: input => (input >= 0 && input <= 100) ? true : 'Humidity must be between 0 and 100%'
      },
      {
        type: 'number',
        name: 'space',
        message: 'Available vertical space (meters):',
        default: 2,
        validate: input => (input > 0) ? true : 'Space must be positive'
      },
      {
        type: 'list',
        name: 'lightSource',
        message: 'What is your primary light source?',
        choices: ['Natural sunlight', 'LED grow lights', 'Fluorescent lights', 'Mixed (natural + artificial)']
      },
      {
        type: 'number',
        name: 'farmWidth',
        message: 'Width of your growing area (meters):',
        default: 1,
        validate: input => (input > 0) ? true : 'Width must be positive'
      },
      {
        type: 'number',
        name: 'farmDepth',
        message: 'Depth of your growing area (meters):',
        default: 1,
        validate: input => (input > 0) ? true : 'Depth must be positive'
      }
    ]);

    // Determine climate zone based on temperature and humidity
    const zone = determineClimateZone(answers.avgTemp, answers.humidity);
    
    // Get recommended crops for the climate zone
    const recommendedCrops = getRecommendedCrops(zone, answers.lightSource);
    
    // Calculate farming parameters for each recommended crop
    const farmingPlan = calculateFarmingParameters(recommendedCrops, answers);
    
    // Display results
    displayFarmingPlan(zone, answers, farmingPlan);
    
    // Provide additional setup instructions
    provideSetupInstructions(answers, zone);
  } catch (error) {
    console.error('An error occurred:'.error, error.message);
  }
}

/**
 * Determine the climate zone based on temperature and humidity
 */
function determineClimateZone(temperature, humidity) {
  return Object.keys(climateZones).find(zone => {
    const { temp: [min, max], humidity: [hMin, hMax] } = climateZones[zone];
    return temperature >= min && temperature <= max &&
           humidity >= hMin && humidity <= hMax;
  }) || 'temperate'; // Default to temperate if no match
}

/**
 * Get crops recommended for the given climate zone and light conditions
 */
function getRecommendedCrops(zone, lightSource) {
  const zoneData = climateZones[zone];
  let eligibleCrops = [...zoneData.crops];
  
  // Filter based on light source if needed
  if (lightSource === 'LED grow lights' || lightSource === 'Fluorescent lights') {
    eligibleCrops = eligibleCrops.filter(crop => 
      cropData[crop].lightRequirements.artificial === true);
  }
  
  // Return top 3 recommended crops
  return eligibleCrops.slice(0, 3);
}

/**
 * Calculate detailed farming parameters for each crop
 */
function calculateFarmingParameters(crops, userInput) {
  const { space, farmWidth, farmDepth } = userInput;
  const totalArea = farmWidth * farmDepth;
  const tiers = Math.floor(space / 0.3); // Assuming 30cm per tier
  
  return crops.map(crop => {
    const data = cropData[crop];
    const seedsPerTier = Math.ceil(data.seeds.per_sqm * totalArea);
    const totalSeeds = seedsPerTier * tiers;
    const waterPerDay = data.water.daily * totalArea * tiers;
    
    return {
      crop,
      tiers,
      totalSeeds,
      waterPerDay,
      waterMethod: data.water.method,
      lightHours: data.light.daily,
      lightIntensity: data.light.lux,
      nutrients: data.nutrients,
      spacing: Math.sqrt(10000 / data.seeds.per_sqm), // cm between plants
      harvestTime: data.harvestTime
    };
  });
}

/**
 * Display the complete farming plan to the user
 */
function displayFarmingPlan(zone, userInput, farmingPlan) {
  console.log('\n=== VERTICAL FARMING PLAN ==='.title);
  console.log(`Location: ${userInput.location}`.data);
  console.log(`Climate Zone: ${zone.toUpperCase()}`.data);
  console.log(`Temperature: ${userInput.avgTemp}°C`.data);
  console.log(`Humidity: ${userInput.humidity}%`.data);
  console.log(`Vertical Space: ${userInput.space}m (${Math.floor(userInput.space / 0.3)} tiers)`.data);
  console.log(`Growing Area: ${userInput.farmWidth}m × ${userInput.farmDepth}m (${userInput.farmWidth * userInput.farmDepth}m²)`.data);
  
  console.log('\n📋 Recommended Crops:'.subtitle);
  
  farmingPlan.forEach((plan, index) => {
    console.log(`\n🌱 ${index + 1}. ${plan.crop}`.highlight);
    console.log(`   Vertical Tiers: ${plan.tiers}`);
    console.log(`   Seeds Needed: ${plan.totalSeeds} (${plan.totalSeeds / plan.tiers} per tier)`);
    console.log(`   Water Requirements: ${plan.waterPerDay.toFixed(1)}L/day (${plan.waterMethod} system)`);
    console.log(`   Light Requirements: ${plan.lightHours}h daily (${plan.lightIntensity} lux)`);
    console.log(`   Nutrients: ${plan.nutrients.join(', ')}`);
    console.log(`   Plant Spacing: ${plan.spacing.toFixed(1)}cm between plants`);
    console.log(`   Harvest Time: ${plan.harvestTime} days from planting`);
  });
}

/**
 * Provide additional setup instructions based on climate and other factors
 */
function provideSetupInstructions(userInput, zone) {
  console.log('\n🔧 SETUP INSTRUCTIONS'.subtitle);
  console.log('1. Structure Setup:'.highlight);
  console.log(`   - Build ${Math.floor(userInput.space / 0.3)} tiers with strong shelving`);
  console.log('   - Ensure each tier can hold at least 10kg/m²');
  console.log('   - Use waterproof material for shelving');
  
  console.log('\n2. Irrigation System:'.highlight);
  console.log('   - Install a main water reservoir at the base');
  console.log('   - Set up a pump with timer for automation');
  console.log('   - Use drip irrigation lines for each tier');
  console.log('   - Consider a water recycling system to collect runoff');
  
  console.log('\n3. Lighting (if needed):'.highlight);
  if (userInput.lightSource.includes('LED')) {
    console.log('   - Install LED grow lights 30-45cm above each tier');
    console.log('   - Use a timer to provide the recommended light hours');
    console.log('   - Position lights to provide even coverage');
  } else if (userInput.lightSource.includes('Fluorescent')) {
    console.log('   - Mount fluorescent fixtures 15-20cm above plants');
    console.log('   - Use full-spectrum bulbs for vegetative growth');
    console.log('   - Install reflectors to maximize light efficiency');
  }
  
  console.log('\n4. Climate Control:'.highlight);
  if (zone === 'tropical') {
    console.log('   - Ensure good ventilation to prevent mold');
    console.log('   - Consider a dehumidifier if indoor humidity exceeds 80%');
  } else if (zone === 'arid') {
    console.log('   - Use humidity trays or a humidifier');
    console.log('   - Install shade cloth to reduce light intensity if needed');
  } else if (zone === 'cold') {
    console.log('   - Provide insulation around the structure');
    console.log('   - Consider using heat mats under seedlings');
  }
  
  console.log('\n5. Monitoring:'.highlight);
  console.log('   - Check moisture levels every 1-2 days');
  console.log('   - Measure pH of irrigation water weekly (target: 5.5-6.5)');
  console.log('   - Monitor plant health and adjust nutrients as needed');
  
  console.log('\n6. Maintenance Schedule:'.highlight);
  console.log('   - Clean the system thoroughly between crop cycles');
  console.log('   - Sanitize irrigation lines monthly');
  console.log('   - Replace growing medium as recommended for each crop');
  console.log('   - Rotate crops to prevent disease buildup');
  
  console.log('\n🌟 Happy Vertical Farming! 🌟'.success);
}

// Start the application
startVerticalFarmAssistant();