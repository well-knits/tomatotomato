#!/usr/bin/env node

var format = require('./format')

  , connection = require('./connect')()

  , WebSocketServer = require('ws').Server
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
  var ondata = function (obj) {
        obj.countdown = format(obj.countdown);
        ws.send(JSON.stringify(obj))
      },
      onclose = function () {
        ws.send(JSON.stringify({ type: 'close' }));
      }

  connection.on('data', ondata)
  connection.on('close', onclose)
  })
})
