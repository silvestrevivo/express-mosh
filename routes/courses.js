const express = require('express');
const router = express.Router();
const Joi = require('joi');

const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
]

// get requests
router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if(!course) return res.status(404).send('The course with the given ID was not found');
  res.send(course);
});

// post requests
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;
