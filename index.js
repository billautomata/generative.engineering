var crypto = require('crypto')
var fs = require('fs')

var d3 = require('d3')
var uuid = require('node-uuid')
var morgan = require('morgan')
var restify = require('restify')

var Noise = require('noisejs')
var noise = new Noise.Noise()

noise.seed(3)
console.log(noise.perlin2(0.1,0.3))

// create stream for morgan log
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

var server = restify.createServer()

server.listen(8001) // start server

// setup the logger
server.use(morgan(':date[iso]\t:remote-addr\t:url\t:response-time\t:user-agent', {stream: accessLogStream}))

// enable CORS
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

server.get('/', function(req,res,next){
  res.send(
    [
      { description: 'REST API for generative art datasets'},
      { author: 'http://twitter.com/billautomata'},
    { github: 'https://github.com/billautomata/generative.engineering' },
      { example_use: "http://generative.engineering/random/normal/100" },
      {  directory: [
          '/random/normal/:count',
          '/random/logNormal/:count',
          '/uuid/',
          '/noise/perlin/'
        ]
      },
      {
        coming_soon:[
          '/noise/perlin/:x/:y',
          '/noise/perlin/:x/:y/:z',
          '/noise/simplex/:x/:y',
          '/noise/simplex/:x/:y:z'
        ]
      }
    ]
  ) // end of res.send
  res.end()
  return next()


})

server.get('/random/:type/:count', return_random_numbers)

function return_random_numbers(req,res,next){

  var count = parseInt(req.params.count)
  var type = req.params.type

  console.log(count,type)

  var m = []
  console.log(typeof count)

  if(count > 1000){
    count = 1000
  }

 if (type==='normal' || type === 'logNormal') {

    for(var i = 0; i < count; i++){
      m.push(d3.random[type]()())
    }

  } else {
    m = [ 'invalid type' ]
  }

  res.send(m)
  res.end()
  return next()

}

server.get('/uuid', function(req,res,next){

  res.write(uuid.v4())
  res.end()
  return next()

})

server.get('/crypto/bytes/:count', function(req,res,next){

  var count = parseInt(req.params.count)
  if(count > 4096){
    count = 4096
  } else if(count <= 0){
    count = 1
  }

  crypto.randomBytes(count,function(ex,buf){
    res.write(buf.toString('base64'))
    res.end()
    return next()
  })

})

server.get('/testing', function(req,res,next){

  console.log(req.headers['x-forwarded-for'])
  res.write(req.headers['x-forwarded-for'])
  res.end()
  next()


})

server.get('/stats', function(req,res,next){

  res.send('stats')
  res.end()
  next()
})


server.get(/\/noise(.*)/ , function(req,res,next){

  var params = {}

  var args = req.params[0].split('/')

  if(args.length <= 2 ){
    res.send({example:'http://generative.engineering/noise/simplex/seed/256/x/0.113/y/0.001/z/-0.32'})
    next()
  }

  var which_noise = 'perlin'
  var seed, x, y, z

  for(var i = 0; i < args.length; i++){

    if(args[i] === 'simplex'){
      which_noise = 'simplex'
    } else {
      if(args[i] === 'x'){
        x = parseFloat(args[i+1])
        i += 1
      } else if(args[i] === 'y'){
        y = parseFloat(args[i+1])
        i += 1
      } else if(args[i] === 'z'){
        z = parseFloat(args[i+1])
        i += 1
      } else if(args[i] === 'seed'){
        seed = parseFloat(args[i+1])
        i += 1
      }

    }
  }

  if(seed !== undefined){
    noise.seed(seed)
  }

  var m

  if(which_noise === 'perlin'){
    if(z === undefined){
      m = noise.perlin2(x,y)
    } else {
      m = noise.perlin3(x,y,z)
    }
  } else {

    if(z === undefined){
      m = noise.simplex2(x,y)
      console.log(noise.simplex)
    } else {
      m = noise.simplex3(x,y,z)
    }

  }

  res.send([m])
  next()

})
