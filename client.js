#!/usr/bin/env node

var fs = require('fs')
  , mdns = require('mdns')
  , Notification = require('node-notifier')
  , notifier = new Notification()
  , browser = mdns.createBrowser(mdns.tcp('tomatotomato'))
  , net = require('net')

  , logStream = fs.createWriteStream(__dirname + '/LOG', { flags: 'a' })

  , charm = require('charm')()
  , split = require('split')
  , format = function (seconds) {
      var minutes = Math.floor(seconds / 60).toString()
        , seconds = (seconds % 60).toString()

      if (minutes.length === 1) minutes = '0' + minutes
      if (seconds.length === 1) seconds = '0' + seconds
      return minutes + ':' + seconds
    }

  , singleLineOutput = function (color, string) {
      charm
        .foreground(color)
        .erase('line')
        .write(string)
        .left(string.length)
    }
  , write = function (json) {
      var data = JSON.stringify(json) + '\n'

      logStream.write(data)
    }
    // find out if this file was included from the server or not
  , isRemote = module.parent ? module.parent.filename === __dirname + '/server.js' : false

charm.pipe(process.stdout)

charm.cursor(false)

browser.on('serviceUp', function(service) {
  var client = net.connect(service.port, service.host)
    , log = function (obj) {
        write({
            port: service.port
          , host: service.host
          , type: obj.type
          , countdown: obj.countdown
          , timestamp: (new Date()).toJSON()
          , remote: isRemote
        })
      }

  client.pipe(split()).on('data', function (chunk) {
    if (!chunk) return;
    var obj = JSON.parse(chunk)

    if (obj.type === 'tomato') {
      singleLineOutput('red', format(obj.countdown))
      if (obj.countdown === 0)
        notifier.notify({ message: 'Let\'s relax for a while!'})
    } else {
      singleLineOutput('green', format(obj.countdown))
      if (obj.countdown === 0)
        notifier.notify({ message: 'Come on! Let\'s work!'})
    }
    log(obj)
  })

  client.on('error', function (err) {})

  client.on('close', function () {
    singleLineOutput('yellow', 'Catch up ketchup!')
  })
})

singleLineOutput('yellow', 'I have not yet connected with my master')

browser.start()
