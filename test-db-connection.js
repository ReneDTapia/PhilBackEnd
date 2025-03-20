require('dotenv').config();
const { createTunnel } = require('./config/database');

async function testConnection() {
  console.log('=== Testing Database Connection via SSH Tunnel ===');
  console.log('SSH Details:');
  console.log(`  Host: ${process.env.SSH_HOST}`);
  console.log(`  User: ${process.env.SSH_USER}`);
  console.log(`  Port: ${process.env.SSH_PORT}`);
  
  console.log('\nDatabase Details:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  User: ${process.env.DB_USER}`);
  
  try {
    console.log('\nEstablishing SSH tunnel and database connection...');
    const { sequelize, server } = await createTunnel();
    
    console.log('\nConnection successful!');
    console.log('Database information:');
    console.log(`  Dialect: ${sequelize.getDialect()}`);
    console.log(`  Database name: ${sequelize.getDatabaseName()}`);
    
    console.log('\nRunning a test query...');
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    console.log(`  Server time: ${results[0].current_time}`);
    
    // Optional: Run an additional query to show table names
    try {
      const [tables] = await sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      
      console.log('\nDatabase tables:');
      if (tables.length === 0) {
        console.log('  No tables found');
      } else {
        tables.forEach((table, index) => {
          console.log(`  ${index + 1}. ${table.table_name}`);
        });
      }
    } catch (err) {
      console.error('Error listing tables:', err.message);
    }
    
    console.log('\nClosing connection...');
    if (server && typeof server.close === 'function') {
      server.close();
    }
    await sequelize.close();
    console.log('Connection closed successfully.');
    
  } catch (error) {
    console.error('\nConnection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection().then(() => {
  console.log('\nTest completed.');
  process.exit(0);
}); 