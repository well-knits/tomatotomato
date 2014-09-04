var reconnect = require('reconnect-ws')
  , elm = document.getElementById('countdown')

reconnect(function (stream) {
  stream.on('data', function (chunk) {
    var obj = JSON.parse(chunk)
    if (obj.type === 'pause')
      elm.style.color = 'green'
    else
      elm.style.color = 'red'

    elm.innerHTML = obj.countdown;
  })
}).connect('ws://' + window.location.host)
