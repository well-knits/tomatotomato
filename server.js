var EventEmitter = require('events').EventEmitter
  , tomatoLength = 25 * 60
  , pauseLength = 5 * 60

  , emitter = new EventEmitter()

  , tomato = function () {
        var start = Date.now()
          , interval = setInterval(
                function () {
                  var countdown = tomatoLength - Math.round((Date.now() - start) / 1000)
                  emitter.emit('tomato', countdown)
                  if (countdown === 0) {
                    clearInterval(interval)
                    pause()
                  }
                }
              , 1000
            )
      }
    , pause = function (callback) {
        var start = Date.now()
          , interval = setInterval(
                function () {
                  var countdown = pauseLength - Math.round((Date.now() - start) / 1000)
                  emitter.emit('pause', countdown)
                  if (countdown === 0) {
                    clearInterval(interval)
                    tomato()
                  }
                }
              , 1000
            )
      }

emitter.setMaxListeners(Infinity)

require('net').createServer(function (connection) {
  var onTomato = function (countdown) {
        connection.write(JSON.stringify({ type: 'tomato', countdown: countdown }) + '\n')
      }
    , onPause = function (countdown) {
        connection.write(JSON.stringify({ type: 'pause', countdown: countdown }) + '\n')
      }
    , cleanup = function () {
        emitter.removeListener('tomato', onTomato)
        emitter.removeListener('pause', onPause)
        connection.removeListener('end', cleanup)
        connection.removeListener('error', cleanup)
      }

  emitter.on('tomato', onTomato)
  emitter.on('pause', onPause)

  connection.once('end', cleanup)
  connection.once('error', cleanup)

}).listen(1999)

tomato()
require('./client')