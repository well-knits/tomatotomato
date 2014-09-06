#!/usr/bin/env node

var fs = require('fs')
  , http = require('http')

  , serveBrowserify = require('serve-browserify')({
      root: __dirname + '/public'
    })
  , ws = require('ws')

  , connection = require('./connect')()
  , format = require('./format')

  , server = http.createServer(function (req, res) {
      if (req.url === '/client.js') {
        serveBrowserify(req, res)
      } else {
        fs.readFile(__dirname + '/public/index.html', function (err, html) {

          res.writeHead(200, { 'content-type': 'text/html' })
          res.end(html)
        })
      }
    }).listen(2929)

ws.createServer({ server: server }, function (socket) {
  var send = function (data) { socket.send(JSON.stringify(data)) }

  var ondata = function (obj) {
        send({ countdown: format(obj.countdown), type: obj.type })
      }
    , onclose = function () {
        send({ type: 'close' })
      }

  connection.on('data', ondata)
  connection.on('close', onclose)
  socket.on('close', function () {
    connection.removeListener('data', ondata)
    connection.removeListener('close', onclose)
  })
})
