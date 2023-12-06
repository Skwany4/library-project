const mysql = require('mysql');

const dbConfig = {
  host: 'mysql.agh.edu.pl',
  user: 'szymonkw',
  password: 'RBhfFnvXWaWVoDTz',
  database: 'szymonkw'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    throw err;
  }
  console.log('Succes');
});

module.exports = connection;