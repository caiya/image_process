const fastify = require('fastify')()

const concat = require('concat-stream')
const fs = require('fs')
const pump = require('pump')

fastify.register(require('fastify-multipart'))

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/upload', function (req, reply) {

  const mp = req.multipart(handler, function (err) {
    console.log('upload completed')
    reply.code(200).send()
  })

  // mp is an instance of
  // https://www.npmjs.com/package/busboy

  mp.on('field', function (key, value) {
    console.log('form-data', key, value)
  })

  function handler (field, file, filename, encoding, mimetype) {
    // to accumulate the file in memory! Be careful!
    //
    // file.pipe(concat(function (buf) {
    //   console.log('received', filename, 'size', buf.length)
    // }))
    //
    // or

    pump(file, fs.createWriteStream('./public/uploads/1.jpg'))

    // be careful of permission issues on disk and not overwrite
    // sensitive files that could cause security risks
  }
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