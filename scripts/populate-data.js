const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SOURCE_URL = 'https://raw.githubusercontent.com/marchah/sea-ports/refs/heads/master/lib/ports.json';
const DB_FILE = path.join(__dirname, '..', 'db.json');

async function fetchAndPopulateData() {
  try {
    console.log('Fetching data from source...');
    const response = await axios.get(SOURCE_URL);
    const portsData = response.data;
    
    // Transform data to array format
    const portsArray = Object.entries(portsData).map(([id, data]) => ({
      id,
      ...data
    }));
    
    // Create db.json with the ports data
    const dbData = {
      ports: portsArray
    };
    
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
    console.log('Data successfully populated to db.json');
    
  } catch (error) {
    console.error('Error populating data:', error);
    process.exit(1);
  }
}

fetchAndPopulateData();
