
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}

// Configuration
console.log('Application name', config.get('name'));
console.log('Mail server', config.get('mail').host);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
