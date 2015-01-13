var uuid = require('node-uuid')

var fs = require('fs')
var restify = require('restify')
var d3 = require('d3')

var morgan = require('morgan')


var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})


var server = restify.createServer()
server.listen(8001)

// setup the logger
server.use(morgan(':date[iso]\t:remote-addr\t:url\t:response-time\t:user-agent', {stream: accessLogStream}))


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
      { description: 'a REST API for random data for generative art'},
      { author: 'http://twitter.com/billautomata'},
      { example_use: "http://generative.engineering/random/normal/100" },
      {  directory: [
          '/random/normal/:count',
          '/random/logNormal/:count',
          '/uuid/'
        ]
      },
      {  coming_soon:[
          '/noise/perlin/:x/:y',
          '/noise/perlin/:x/:y/:z',
          '/noise/simplex/:x/:y',
          '/noise/simplex/:x/:y:z'
        ]
      }
    ]
  ) // end of res.send


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
  return next()

}

server.get('/uuid', function(req,res,next){

  res.send(uuid.v4())
  return next()

})
