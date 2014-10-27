var reconnect = require('simple-reconnect-ws')
  , elm = document.getElementById('countdown')

  , onmessage = function (event) {
      var obj = JSON.parse(event.data)

      if (obj.type === 'pause') {
        elm.style.color = 'green'
        elm.innerHTML = obj.countdown;
      } else if (obj.type === 'work') {
        elm.style.color = 'red'
        elm.innerHTML = obj.countdown;
      } else if (obj.type === 'close') {
        elm.style.color = 'yellow'
        elm.innerHTML = 'Catch up ketchup!'
      }
    }
  , onreconnect = function () {
      elm.style.color = 'yellow'
      elm.innerHTML = 'Catch up ketchup!'
    }

reconnect('ws://' + window.location.host, onmessage, onreconnect)
