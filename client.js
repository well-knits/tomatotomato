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

charm.pipe(process.stdout)

charm.cursor(false)

browser.on('serviceUp', function(service) {
  var client = net.connect(service.port, service.host)
  client.pipe(split()).on('data', function (chunk) {
    var obj = JSON.parse(chunk)

    if (obj.type === 'tomato') {
      charm
        .foreground('red')
        .left(5)
        .write(format(obj.countdown))
    } else {
      charm
        .foreground('green')
        .left(5)
        .write(format(obj.countdown))
    }
  })
})

browser.start()
