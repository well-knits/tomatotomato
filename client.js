var mdns = require('mdns')
  , browser = mdns.createBrowser(mdns.tcp('tomatotomato'))
  , net = require('net')

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
      .erase('start')
      .left(20)
      .write(string)
  }

charm.pipe(process.stdout)

charm.cursor(false)

browser.on('serviceUp', function(service) {
  var client = net.connect(service.port, service.host)
  client.pipe(split()).on('data', function (chunk) {
    if (!chunk) return;
    var obj = JSON.parse(chunk)

    if (obj.type === 'tomato') {
      singleLineOutput('red', format(obj.countdown))
    } else {
      singleLineOutput('green', format(obj.countdown))
    }
  })

  client.on('close', function () {
    singleLineOutput('yellow', 'Catch up ketchup!')
  })
})

browser.start()
