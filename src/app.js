const express = require('express')
const app = express()

// Route for "/home"
app.get('/home', (req, res) => {
  res.send('Hello World! I am Asit Kumar. What are you doing?')
})

// Route for "/text"
app.get('/text', (req, res) => {
  res.send('Hello from the server!')
})

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
