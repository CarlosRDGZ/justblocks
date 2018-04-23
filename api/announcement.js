const announ = require('express').Router()
const bodyParser = require('body-parser')

announ.use(bodyParser.urlencoded({ extended: true }))
announ.use(bodyParser.json())

const announs = [
  {
    id: '0',
    title: 'Titulo',
    content: 'Contenido'
  },
  {
    id: '1',
    title: 'Titulo',
    content: 'Contenido'
  },
  {
    id: '2',
    title: 'Titulo',
    content: 'Contenido'
  },
  {
    id: '3',
    title: 'Titulo',
    content: 'Contenido'
  }
]

announ.route('/')
  .get((req,res) => res.status(200).json(announs))
  .post((req,res) => res.status(200).send('CREATE ANNOUNCEMENT'))

announ.route('/:id')
  .get((req,res) => res.status(200).json(announs[req.params.id]))
  .put((req,res) => res.status(200).send('UPDATE ANNOUNCEMENT'))
  .delete((req,res) => res.status(200).send('DELTE ANNOUNCEMENT'))

module.exports = announ;