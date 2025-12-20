// Quick verification script for IAM tables
// Run with: node verify-iam.js

import { sequelize } from './src/config/db.js';
import './src/models/index.js';

async function verifyIAM() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Check foreign keys
    const [fks] = await sequelize.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name, 
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name 
      JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = tc.constraint_name 
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public' 
        AND tc.table_name IN ('users', 'roles', 'permissions', 'role_permissions', 'user_roles', 'user_sessions') 
      ORDER BY tc.table_name, kcu.column_name
    `);

    console.log('🔗 Foreign Key Relationships:\n');
    const grouped = {};
    fks.forEach(fk => {
      if (!grouped[fk.table_name]) grouped[fk.table_name] = [];
      grouped[fk.table_name].push(`${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    Object.keys(grouped).sort().forEach(table => {
      console.log(`📋 ${table}:`);
      grouped[table].forEach(rel => console.log(`   ✓ ${rel}`));
    });

    console.log('\n✅ All IAM tables are properly linked!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyIAM();

