#!/usr/bin/env node

require('fs').createReadStream(__dirname + '/LOG').pipe(process.stdout)