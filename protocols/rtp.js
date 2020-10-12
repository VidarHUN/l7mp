// L7mp: A programmable L7 meta-proxy
//
// Copyright 2019 by its authors.
// Some rights reserved. See AUTHORS.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

const log = require('npmlog');
const _   = require('lodash');

const ipaddr   = require('ipaddr.js').ipaddr;
const Protocol = require('../protocol.js').Protocol;

class RTPProtocol extends Protocol{
    constructor(opts) {
        super(opts)

        _.extend(this.formats, {
            SSRC: {
                type: {type: 'SSRC'}
            },
            PT: {
                type: {type: 'PT'}
            }
        })

        _.extend(this.serializers, {
            'SSRC': {
                decoder: function(v){
                    let res = v.readUInt32BE(8)
                    return {val: res, len: 32}
                },
            },
            "PT": {
                decoder: function(v) {
                    let res = v.readUInt32BE(0)
                    return {val: (res & 0x7F8000) >> 16, len: 7}
                }
            }
        })
    }
}

module.exports.RTPProtocol = RTPProtocol