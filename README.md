# tomatotomato

[Pomodoro](http://en.wikipedia.org/wiki/Pomodoro_Technique). But distributed. And awesome.

Distributed in this case means that multiple people can follow the same pomodoro clock automagically on the same network, using [mdns](http://npmjs.org/package/mdns).

[![NPM](https://nodei.co/npm/tomatotomato.png?downloads&stars)](https://nodei.co/npm/tomatotomato/)

[![NPM](https://nodei.co/npm-dl/tomatotomato.png)](https://nodei.co/npm/tomatotomato/)

## Installation

```
npm install tomatotomato -g
```

## Run

Run `tomatotomato-server` to start a new tomato session. A session runs for 25 minutes and then breaks for 5 minutes before starting again. A `tomatotomato-server` is also a `tomatotomato-client`. Make sure that there's only one server running simultaniously, otherwise weird things will happen.

Run `tomatotomato-client` to start listening for and joining tomato sessions on your local network. You need someone on your local network to be the server for this to work.


## Licence

Copyright (c) 2014 David Björklund & Lisa Övermyr

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

