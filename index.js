const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Lazy Language to the rescue for us lazy monkeys trying to learn a new language')
})

app.listen(3000)