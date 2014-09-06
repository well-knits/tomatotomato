module.exports = function (seconds) {
      var minutes = Math.floor(seconds / 60).toString()
        , seconds = (seconds % 60).toString()

      if (minutes.length === 1) minutes = '0' + minutes
      if (seconds.length === 1) seconds = '0' + seconds
      return minutes + ':' + seconds
    }