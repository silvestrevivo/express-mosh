const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const config = require('config');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}

// Configuration
console.log('Application name', config.get('name'));
console.log('Mail server', config.get('mail').host);

const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
]

// get requests
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if(!course) return res.status(404).send('The course with the given ID was not found');
  res.send(course);
});

// post requests
app.post('/api/courses', (req, res) => {
  //Validation
  const { error } = validateCourse(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(course);
});

// put requests
app.put('/api/courses/:id', (req, res) => {
  // Try to find the course to update
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if(!course) return res.status(404).send(`The course with the given ID isn't found`)

  // Validation
  const { error } = validateCourse(req.body);
  // 400 => on put is a Bad request
  if(error) return res.status(400).send(error.details[0].message)

  // Update course
  course.name = req.body.name;
  res.send(course)
});

// delete requests
app.delete('/api/courses/:id', (req, res) => {
  // Try to find the course to delete
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if(!course) return res.status(404).send(`The course with the given ID isn't found`)

  // Element to delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
})

// Function validation
function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema)
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
