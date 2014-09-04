var reconnect = require('reconnect-ws')
  , elm = document.getElementById('countdown')

reconnect(function (stream) {
  stream.on('data', function (chunk) {
    var obj = JSON.parse(chunk)
    if (obj.type === 'pause') {
      elm.style.color = 'green'
      elm.innerHTML = obj.countdown;
    } else if (obj.type === 'tomato') {
      elm.style.color = 'red'
      elm.innerHTML = obj.countdown;
    } else if (obj.type === 'close') {
      elm.style.color = 'yellow'
      elm.innerHTML = 'Catch up ketchup!'
    }
  })
}).connect('ws://' + window.location.host)
