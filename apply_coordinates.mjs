import fs from 'fs';
import path from 'path';

// This script can be run if the user pastes or saves manual_coordinates.json
const jsonPath = path.join(process.cwd(), 'docs', 'manual_coordinates.json');
if (fs.existsSync(jsonPath)) {
  const config = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('Found manual_coordinates.json with figures:', Object.keys(config).join(', '));
} else {
  console.log('manual_coordinates.json not found yet.');
}
