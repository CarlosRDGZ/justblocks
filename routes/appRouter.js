const express = require('express'),
      router = express.Router()

router.use(function log(req, res, next) {
  console.log(`Time: ${new Date(Date.now()).toLocaleTimeString()}`)
  console.log(`metod: %s, url: %s, path: %s`, req.method, req.url, req.path)
  next()
})

router.route('/')
  .get((req, res) => {
    // res.sendFile(path.resolve(__dirname + '/../public/index.html'))
    res.send([{},{}])
  })
  .post((req, res) => {
    res.send(req.body)
    console.log(req.body)
  })

router.use((req, res, next) => {
  res.send('Inside Router')
})

module.exports = router