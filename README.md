# generative.engineering
REST API for generative art datasets.

[example](http://generative.engineering/random/normal/3)

list of endpoints
--
* `GET` `/random/normal/:count`
* `GET` `/random/logNormal/:count`
* `GET` `/uuid/`
* `GET` `/crypto/bytes/:count`


####noise
* `GET` `/noise/:type/x/{number}/y/{number}/z/{number}/:seed`

This endpoint accepts a series of optional and require parameters.  Passing `simplex` or `perlin` in the path will set the type of noise.  Passing `seed` `x` `y` or `z` the parser will take the number in the path **immediately after** the key as the value for the key.  

For example, `noise/x/0.1/y/0.44` would parse into `{ x : 0.1, y : 0.44 }`
* `example` http://generative.engineering/noise/simplex/seed/256/x/0.1/y/0.33/z/-0.91
  * yields results for the following parameters
    * x `0.1`
    * y `0.33`
    * z `0.91`
      * optional, defaults to 2D function if not present
    * seed `256`
      * range: `[0.0,1.0]` or `[0,65536]`
      * optional, defaults to static random seed
    * type `simplex`
      * optional, defaults to `perlin`
