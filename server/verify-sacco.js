// Verify SACCO Multi-Tenancy tables
import { sequelize } from './src/config/db.js';
import './src/models/index.js';

async function verifySACCO() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    const tables = ['saccos', 'sacco_branches', 'sacco_users', 'sacco_settings', 'sacco_audit_logs'];
    console.log('🔍 Checking SACCO Multi-Tenancy tables:\n');

    for (const table of tables) {
      try {
        const [results] = await sequelize.query(
          `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = '${table}'`
        );
        const exists = results[0].count > 0;
        const status = exists ? '✅' : '❌';
        console.log(`${status} ${table.padEnd(20)} - ${exists ? 'EXISTS' : 'MISSING'}`);
        
        if (exists) {
          const [cols] = await sequelize.query(
            `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}' ORDER BY ordinal_position`
          );
          console.log(`   Columns (${cols.length}): ${cols.map(c => c.column_name).join(', ')}`);
        }
      } catch (e) {
        console.log(`⚠️  Error checking ${table}: ${e.message}`);
      }
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifySACCO();

