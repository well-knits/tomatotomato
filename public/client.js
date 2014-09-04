var elm = document.getElementById('countdown')

  , connect = function () {
      var socket = new WebSocket('ws://' + window.location.host)
        , onmessage = function (event) {
            var obj = JSON.parse(event.data)

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
          }
        , reconnect = function () {
            elm.style.color = 'yellow'
            elm.innerHTML = 'Catch up ketchup!'

            socket.removeEventListener('message', onmessage)
            socket.removeEventListener('error', reconnect)
            socket.removeEventListener('close', reconnect)

            setTimeout(connect, 300)
          }

      socket.addEventListener('error', reconnect)
      socket.addEventListener('close', reconnect)
      socket.addEventListener('message', onmessage)
    }

connect()
