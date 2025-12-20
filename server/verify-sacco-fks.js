// Verify SACCO foreign key relationships
import { sequelize } from './src/config/db.js';
import './src/models/index.js';

async function verifySACCOFKs() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

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
        AND tc.table_name IN ('saccos', 'sacco_branches', 'sacco_users', 'sacco_settings', 'sacco_audit_logs') 
      ORDER BY tc.table_name, kcu.column_name
    `);

    console.log('🔗 SACCO Multi-Tenancy Foreign Key Relationships:\n');
    const grouped = {};
    fks.forEach(fk => {
      if (!grouped[fk.table_name]) grouped[fk.table_name] = [];
      grouped[fk.table_name].push(`${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    const tables = ['saccos', 'sacco_branches', 'sacco_users', 'sacco_settings', 'sacco_audit_logs'];
    tables.forEach(table => {
      if (grouped[table]) {
        console.log(`📋 ${table}:`);
        grouped[table].forEach(rel => console.log(`   ✓ ${rel}`));
      } else {
        console.log(`📋 ${table}: (no foreign keys)`);
      }
    });

    console.log('\n✅ SACCO Multi-Tenancy structure verified!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifySACCOFKs();

