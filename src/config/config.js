require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'Hostel_yardformix',
    password: process.env.DB_PASSWORD || '9694d0fea0c70ab19513962f597c7d558871fa16',
    database: process.env.DB_NAME || 'Hostel_yardformix',
    host: process.env.DB_HOST || '110ar.h.filess.io',
    port: process.env.DB_PORT || 3305,
    dialect: 'mysql',
    logging: console.log
  },
  test: {
    username: process.env.DB_USERNAME || 'Hostel_yardformix',
    password: process.env.DB_PASSWORD || '9694d0fea0c70ab19513962f597c7d558871fa16',
    database: process.env.DB_NAME || 'Hostel_yardformix_test',
    host: process.env.DB_HOST || '110ar.h.filess.io',
    port: process.env.DB_PORT || 3305,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME || 'Hostel_yardformix',
    password: process.env.DB_PASSWORD || '9694d0fea0c70ab19513962f597c7d558871fa16',
    database: process.env.DB_NAME || 'Hostel_yardformix',
    host: process.env.DB_HOST || '110ar.h.filess.io',
    port: process.env.DB_PORT || 3305,
    dialect: 'mysql',
    logging: false
  }
};