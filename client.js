var client = require('net').connect(1999)

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