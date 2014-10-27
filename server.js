#!/usr/bin/env node

var EventEmitter = require('events').EventEmitter


  , chalk = require('chalk')
  , mdns = require('mdns')
  , networkAddress = require('network-address')

  , tomatoLength = 25 * 60
  , pauseLength = 5 * 60

  , emitter = new EventEmitter()

  , work = function () {
        var start = Date.now()
          , interval = setInterval(
                function () {
                  var countdown = tomatoLength - Math.round((Date.now() - start) / 1000)
                  emitter.emit('work', countdown)
                  if (countdown <= 0) {
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
                if (countdown <= 0) {
                  clearInterval(interval)
                  work()
                }
              }
            , 1000
          )
    }
  , server

emitter.setMaxListeners(Infinity)

server = require('net').createServer(function (connection) {
  var remoteAddress = connection.remoteAddress
    , onTomato = function (countdown) {
        connection.write(JSON.stringify({ type: 'work', countdown: countdown }) + '\n')
      }
    , onPause = function (countdown) {
        connection.write(JSON.stringify({ type: 'pause', countdown: countdown }) + '\n')
      }
    , cleanup = function () {
        console.log(chalk.red('Client disconnected ' + remoteAddress))
        emitter.removeListener('work', onTomato)
        emitter.removeListener('pause', onPause)
        connection.removeListener('end', cleanup)
        connection.removeListener('error', cleanup)
      }

  console.log(chalk.green('Client connected ' + remoteAddress))

  emitter.on('work', onTomato)
  emitter.on('pause', onPause)

  connection.once('end', cleanup)
  connection.once('error', cleanup)

}).listen(function () {
  var ad = mdns.createAdvertisement(mdns.tcp('tomatotomato'), server.address().port)
    , msg = 'server running on ' + networkAddress() + ':' + server.address().port
  console.log(chalk.blue(msg))
  ad.start()
})

work()
