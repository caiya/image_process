const fastify = require('fastify')()

const fs = require('fs')
const pump = require('pump')

fastify.register(require('fastify-multipart'))

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/upload', function (req, reply) {

  const mp = req.multipart((field, file, filename, encoding, mimetype) => {

    pump(file, fs.createWriteStream('./public/uploads/' + filename))

  }, err => {
    console.log('upload completed')
    reply.code(200).send()
  })

  mp.on('field', function (key, value) {
    console.log('form-data', key, value)
  })

})

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()