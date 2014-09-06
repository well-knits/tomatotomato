var EventEmitter = require('events').EventEmitter
  , net = require('net')

  , mdns = require('mdns')
  , split = require('split')

  , connect = function () {
      var browser = mdns.createBrowser(mdns.tcp('tomatotomato'))
        , emitter = new EventEmitter()

      browser.on('serviceUp', function (service) {

        var connection = net.connect(service.port, service.host)

        connection.pipe(split()).on('data', function (chunk) {
          if (!chunk) return;

          var data = JSON.parse(chunk)

          data.port = service.port
          data.host = service.host

          emitter.emit('data', data)
        })

        // swallow the error, don't care
        connection.on('error', function (err) {})

        connection.on('close', function () {
          emitter.emit('close')
        })
      })
      browser.start()

      return emitter
    }

module.exports = connect