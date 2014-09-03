var websocket = require('websocket-stream')
  , stream = websocket('ws://' + window.location.host)
  , elm = document.getElementById('countdown')

stream.on('data', function (chunk) {
  var obj = JSON.parse(chunk)
  if (obj.type === 'pause')
    elm.style.color = 'green'
  else
    elm.style.color = 'red'

  elm.innerHTML = obj.countdown;
})