document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('farming-form');
  const resultsContainer = document.getElementById('results-container');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const userInput = {
      location: document.getElementById('location').value,
      avgTemp: parseFloat(document.getElementById('avgTemp').value),
      humidity: parseFloat(document.getElementById('humidity').value),
      space: parseFloat(document.getElementById('space').value),
      lightSource: document.getElementById('lightSource').value,
      farmWidth: parseFloat(document.getElementById('farmWidth').value),
      farmDepth: parseFloat(document.getElementById('farmDepth').value)
    };
    
    // Process the form data
    const zone = determineClimateZone(userInput.avgTemp, userInput.humidity);
    const recommendedCrops = getRecommendedCrops(zone, userInput.lightSource);
    const farmingPlan = calculateFarmingParameters(recommendedCrops, userInput);
    
    // Display results
    displayResults(userInput, zone, farmingPlan);
  });
  
  /**
   * Display the farming plan results
   */
  function displayResults(userInput, zone, farmingPlan) {
    // Generate HTML for each recommended crop
    let farmingPlanHtml = '';
    farmingPlan.forEach((plan) => {
      farmingPlanHtml += `
        <div class="crop-card">
          <h3>${plan.crop}</h3>
          <div class="crop-details">
            <p><span class="icon-seed"></span><strong>Seeds Needed:</strong> ${plan.totalSeeds} (${Math.ceil(plan.totalSeeds / plan.tiers)} per tier)</p>
            <p><span class="icon-water"></span><strong>Water:</strong> ${plan.waterPerDay.toFixed(1)}L/day (${plan.waterMethod} system)</p>
            <p><span class="icon-light"></span><strong>Light:</strong> ${plan.lightHours}h daily (${plan.lightIntensity} lux)</p>
            <p><span class="icon-nutrients"></span><strong>Nutrients:</strong> ${plan.nutrients.join(', ')}</p>
            <p><span class="icon-spacing"></span><strong>Plant Spacing:</strong> ${Math.sqrt(10000 / cropData[plan.crop].seeds.per_sqm).toFixed(1)}cm between plants</p>
            <p><span class="icon-calendar"></span><strong>Harvest Time:</strong> ${plan.harvestTime || cropData[plan.crop].harvestTime} days from planting</p>
          </div>
        </div>
      `;
    });
    
    // Get climate-specific advice
    const climateAdvice = getClimateAdvice(zone);
    
    // Build the complete results HTML
    const resultsHtml = `
      <header class="header">
        <div class="header-logo">🌱</div>
        <h1>Your Vertical Farming Plan</h1>
        <p>Custom-tailored for ${userInput.location}</p>
      </header>
      
      <div class="info-grid">
        <div class="card">
          <h2>Location & Environment</h2>
          <p><span class="icon-location"></span><strong>Location:</strong> ${userInput.location}</p>
          <p><span class="icon-temp"></span><strong>Climate Zone:</strong> ${zone.charAt(0).toUpperCase() + zone.slice(1)}</p>
          <p><span class="icon-temp"></span><strong>Temperature:</strong> ${userInput.avgTemp}°C</p>
          <p><span class="icon-water"></span><strong>Humidity:</strong> ${userInput.humidity}%</p>
          <p><span class="icon-light"></span><strong>Light Source:</strong> ${userInput.lightSource}</p>
        </div>
        
        <div class="card">
          <h2>Farm Setup</h2>
          <p><strong>Vertical Space:</strong> ${userInput.space}m (${Math.floor(userInput.space / 0.3)} tiers)</p>
          <p><strong>Growing Area:</strong> ${userInput.farmWidth}m × ${userInput.farmDepth}m (${userInput.farmWidth * userInput.farmDepth}m²)</p>
          <p><strong>Total Growing Space:</strong> ${(userInput.farmWidth * userInput.farmDepth * Math.floor(userInput.space / 0.3)).toFixed(1)}m²</p>
          
          <div class="farm-visualization">
            <div class="farm-tiers" style="height: ${Math.min(300, userInput.space * 80)}px; width: ${Math.min(300, userInput.farmWidth * 80)}px;">
              ${Array(Math.floor(userInput.space / 0.3)).fill().map((_, i) => 
                `<div class="farm-tier" style="height: ${Math.min(40, 300 / Math.floor(userInput.space / 0.3))}px; bottom: ${i * (Math.min(40, 300 / Math.floor(userInput.space / 0.3)) + 5)}px;"></div>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2>Recommended Crops</h2>
        <div class="crop-recommendations">
          ${farmingPlanHtml}
        </div>
      </div>
      
      <div class="card">
        <h2>Setup Instructions</h2>
        <div class="setup-instructions">
          <h3>Structure Setup</h3>
          <ul>
            <li>Build ${Math.floor(userInput.space / 0.3)} tiers with strong shelving</li>
            <li>Ensure each tier can hold at least 10kg/m²</li>
            <li>Use waterproof material for shelving</li>
            <li>Consider installing adjustable shelving for flexibility</li>
          </ul>
          
          <h3>Irrigation System</h3>
          <ul>
            <li>Install a main water reservoir at the base</li>
            <li>Set up a pump with timer for automation</li>
            <li>Use drip irrigation lines for each tier</li>
            <li>Consider a water recycling system to collect runoff</li>
            <li>Install a water quality monitor if possible</li>
          </ul>
          
          <h3>Climate Control</h3>
          <ul>
            ${climateAdvice}
          </ul>
        </div>
      </div>
      
      <button id="new-plan-btn" class="btn">Create New Plan</button>
      
      <style>
        /* Additional styles for the results page */
        .crop-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px;
        }
        
        .farm-visualization {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        
        .farm-tiers {
          position: relative;
          border: 2px solid var(--primary);
          border-radius: var(--radius);
          background-color: rgba(59, 183, 143, 0.1);
        }
        
        .farm-tier {
          position: absolute;
          left: 5px;
          right: 5px;
          background-color: var(--primary);
          opacity: 0.7;
          border-radius: 3px;
        }
      </style>
    `;
    
    // Display the results and hide the form
    resultsContainer.innerHTML = resultsHtml;
    resultsContainer.style.display = 'block';
    form.parentElement.style.display = 'none';
    
    // Add event listener to the "Create New Plan" button
    document.getElementById('new-plan-btn').addEventListener('click', () => {
      form.parentElement.style.display = 'block';
      resultsContainer.style.display = 'none';
      form.reset();
    });
  }
});

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
 * Get climate-specific advice based on the zone
 */
function getClimateAdvice(zone) {
  const advice = {
    'tropical': `
      <li>Install good ventilation to prevent mold in high humidity</li>
      <li>Consider a dehumidifier if indoor humidity exceeds 80%</li>
      <li>Use shade cloth to reduce light intensity during peak hours</li>
      <li>Install fans to keep air moving around plants</li>
      <li>Monitor for pests common in tropical environments</li>
    `,
    'arid': `
      <li>Use humidity trays or a humidifier to increase local humidity</li>
      <li>Install shade cloth to reduce light intensity and heat</li>
      <li>Consider adding a misting system on timers</li>
      <li>Use water-retaining growing medium</li>
      <li>Install thermal insulation to maintain cooler temperatures</li>
    `,
    'temperate': `
      <li>Maintain moderate humidity levels (40-60%)</li>
      <li>Ensure good air circulation around plants</li>
      <li>Provide supplemental lighting during darker months</li>
      <li>Consider heating mats for germination during colder seasons</li>
      <li>Rotate crops seasonally for best results</li>
    `,
    'cold': `
      <li>Provide insulation around the structure</li>
      <li>Use heat mats under seedlings for germination</li>
      <li>Install LED lights that don't generate excessive heat</li>
      <li>Consider a small space heater with thermostat</li>
      <li>Focus on cold-tolerant crops during winter months</li>
    `
  };
  
  return advice[zone] || advice['temperate'];
} 