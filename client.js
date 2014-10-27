#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')

  , notifier = require('node-notifier')

  , logStream = (function() {
      var dir = path.join(process.env.HOME, '.tomatotomato')

      require('mkdirp').sync(dir)

      return fs.createWriteStream(path.join(dir, 'LOG'), { flags: 'a' })
    })()

  , charm = require('charm')()

  , connection = require('./connect')()
  , format = require('./format')

  , singleLineOutput = function (color, string) {
      charm
        .foreground(color)
        .erase('line')
        .write(string)
        .left(string.length)
    }
  , normalizeHostname = function (hostString) {
      return hostString.slice(0, hostString.indexOf('.')).toLowerCase()
    }
  , myHostname = normalizeHostname(require('os').hostname())

charm.pipe(process.stdout)

charm.cursor(false)

connection.on('data', function (obj) {
  var isRemote = myHostname !== normalizeHostname(obj.host)

  if (obj.type === 'tomato') {
    singleLineOutput('red', format(obj.countdown))
    if (obj.countdown <= 0)
      notifier.notify({ message: 'Let\'s relax for a while!', sound: 'Glass'})
  } else {
    singleLineOutput('green', format(obj.countdown))
    if (obj.countdown <= 0)
      notifier.notify({ message: 'Come on! Let\'s work!', sound: 'Glass'})
  }

  logStream.write(JSON.stringify({
      port: obj.port
    , host: obj.host
    , type: obj.type
    , countdown: obj.countdown
    , timestamp: (new Date()).toJSON()
    , remote: isRemote
  }) + '\n')

})

connection.on('close', function () {
  singleLineOutput('yellow', 'Catch up ketchup!')
})

singleLineOutput('yellow', 'I have not yet connected with my master')
