require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Client } = require('ssh2');
const net = require('net');

// SSH configuration from environment variables
const sshConfig = {
  host: process.env.SSH_HOST || '44.219.217.34',
  port: process.env.SSH_PORT || 22,
  username: process.env.SSH_USER || 'phill',
  password: process.env.SSH_PASSWORD || 'cencodEnTe',
};

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'ls-81c839ab7c10ee3c93aa4716af17fd2ba9f1b589.c5tfitxvdzwb.us-east-1.rds.amazonaws.com',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'phill',
  password: process.env.DB_PASSWORD || 'ToRiLIbstrEP',
  database: process.env.DB_NAME || 'phill',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
};

// Create SSH tunnel and Sequelize instance
const createTunnel = () => {
  return new Promise((resolve, reject) => {
    const ssh = new Client();
    const localPort = 63334;
    let server = null;
    let sequelize = null;

    console.log('Establishing SSH tunnel to database...');
    console.log(`SSH: ${sshConfig.username}@${sshConfig.host}:${sshConfig.port}`);
    console.log(`DB Target: ${dbConfig.host}:${dbConfig.port}`);

    ssh.on('ready', () => {
      console.log('SSH connection established');

      // Create a local TCP server to forward connections through the SSH tunnel
      server = net.createServer((sock) => {
        ssh.forwardOut(
          '127.0.0.1',     // Local interface to bind to
          localPort,       // Local port to bind to
          dbConfig.host,   // Remote host to connect to
          dbConfig.port,   // Remote port to connect to
          (err, stream) => {
            if (err) {
              console.error('TCP forwarding error:', err);
              sock.end();
              return;
            }

            // Connect the local socket to the remote stream
            sock.pipe(stream).pipe(sock);

            stream.on('close', () => {
              sock.end();
            });

            sock.on('close', () => {
              stream.end();
            });
          }
        );
      }).listen(localPort, '127.0.0.1', () => {
        console.log(`SSH tunnel established. Local port: ${localPort}`);

        // Create Sequelize instance connecting to the local port
        sequelize = new Sequelize(
          dbConfig.database, 
          dbConfig.username, 
          dbConfig.password, 
          {
            host: '127.0.0.1',
            port: localPort,
            dialect: dbConfig.dialect,
            dialectOptions: dbConfig.dialectOptions,
            logging: dbConfig.logging
          }
        );

        // Test the connection
        sequelize.authenticate()
          .then(() => {
            console.log('Database connection established successfully');
            // Return the sequelize instance and a function to close the connection
            resolve({ 
              sequelize, 
              server: {
                close: () => {
                  server.close();
                  ssh.end();
                }
              }
            });
          })
          .catch(err => {
            console.error('Unable to connect to the database:', err);
            server.close();
            ssh.end();
            reject(err);
          });
      });
    });

    ssh.on('error', (err) => {
      console.error('SSH connection error:', err);
      if (server) server.close();
      reject(err);
    });

    // Connect to the SSH server
    ssh.connect(sshConfig);
  });
};

module.exports = { createTunnel }; 