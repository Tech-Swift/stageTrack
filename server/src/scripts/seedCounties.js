import { counties } from 'kenya-locations';
import County from '../models/Stage/County.model.js';
import { sequelize } from '../config/db.js';

async function seedCounties() {
  try {
    await sequelize.authenticate();

    const countyData = counties.map((c) => ({
      name: c.name,
      code: c.code?.toString() || null,
    }));

    await County.bulkCreate(countyData, {
      ignoreDuplicates: true, // avoids errors if some already exist
    });

    console.log('✅ Kenyan counties seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed counties:', error);
    process.exit(1);
  }
}

seedCounties();
