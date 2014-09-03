#!/usr/bin/env node

var fs = require('fs')
  , net = require('net')
  , path = require('path')

  , mdns = require('mdns')
  , Notification = require('node-notifier')
  , notifier = new Notification()
  , browser = mdns.createBrowser(mdns.tcp('tomatotomato'))

  , logStream = (function() {
      var dir = path.join(process.env.HOME, '.tomatotomato')

      require('mkdirp').sync(dir)

      return fs.createWriteStream(path.join(dir, 'LOG'), { flags: 'a' })
    })()

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
    // Assume that if we include this from another file, it's not remote
  , isRemote = !module.parent

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
        notifier.notify({ message: 'Let\'s relax for a while!', sound: 'Glass'})
    } else {
      singleLineOutput('green', format(obj.countdown))
      if (obj.countdown === 0)
        notifier.notify({ message: 'Come on! Let\'s work!', sound: 'Glass'})
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
