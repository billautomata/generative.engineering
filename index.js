var restify = require('restify')
var d3 = require('d3')

var server = restify.createServer()
server.listen(8001)

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

server.get('/', function(req,res,next){
  res.send([
  { description: 'a REST API for random data for generative art'},
  { author: 'http://twitter.com/billautomata'},
  { example_use: "http://generative.engineering/random/normal/100" },
  {  directory: [
      '/random/normal/:count',
      '/random/logNormal/:count'
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
)
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
