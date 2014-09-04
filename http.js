#!/usr/bin/env node

var format = require('./format')

  , connection = require('./connect')()

  , WebSocketServer = require('ws').Server
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

wss.on('connection', function(ws) {
  var stream = websocket(ws)
  connection.on('data', function (obj) {
    obj.countdown = format(obj.countdown);
    stream.write(JSON.stringify(obj))
  })
})
