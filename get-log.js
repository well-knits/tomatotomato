#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')

  , filename = path.join(process.env.HOME, '.tomatotomato', 'LOG')

fs.exists(filename, function (exists) {
  if (exists)
    require('fs').createReadStream(filename).pipe(process.stdout)
})
