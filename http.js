#!/usr/bin/env node

var net = require('net')
  , path = require('path')
  , EventEmitter = require('events').EventEmitter

  , mdns = require('mdns')
  , Notification = require('node-notifier')
  , browser = mdns.createBrowser(mdns.tcp('tomatotomato'))

  , split = require('split')
  , format = function (seconds) {
      var minutes = Math.floor(seconds / 60).toString()
        , seconds = (seconds % 60).toString()

      if (minutes.length === 1) minutes = '0' + minutes
      if (seconds.length === 1) seconds = '0' + seconds
      return minutes + ':' + seconds
    }

  , emitter = new EventEmitter()

  WebSocketServer = require('ws').Server
   , websocket = require('websocket-stream')
   , serveBrowserify = require('serve-browserify')({
         root: __dirname + '/public'
     })
   , server = require('http').createServer(function (req, res) {
       if (req.url === '/client.js') {
         serveBrowserify(req, res)
       } else {
         require('fs').readFile(__dirname + '/public/index.html', function (err, html) {
           res.writeHead(200, { 'content-type': 'text/html' })
           res.end(html)
         })
       }
     }).listen(2929)

   , wss = new WebSocketServer({ server: server })

browser.on('serviceUp', function(service) {
  console.log('serviceUp')

  var client = net.connect(service.port, service.host)

  client.pipe(split()).on('data', function (chunk) {
    if (!chunk) return;
    var obj = JSON.parse(chunk)

    emitter.emit('data', obj)
  })

  client.on('error', function (err) {})

  client.on('close', function () {})
})

browser.start()


wss.on('connection', function(ws) {
  var stream = websocket(ws)
  emitter.on('data', function (obj) {
    obj.countdown = format(obj.countdown);
    stream.write(JSON.stringify(obj))
  })
})
