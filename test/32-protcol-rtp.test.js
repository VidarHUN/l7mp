// L7mp: A programmable L7 meta-proxy
//
// Copyright 2020 by its authors.
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

const assert = require('chai').assert;

const L7mp        = require('../l7mp.js').L7mp;
const RTPProtocol = require('../protocols/rtp.js').RTPProtocol;

const packet = 
	'80 63 94 08 48 27 95 a9 73 ed 01 01 00 87 b2 00 00 00 87 b2 02 03 37 ef 80 73 f4 78 4d 00 00 00 ' +
	'87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 ' +
	'00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 ' +
	'00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 ' +
	'b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 00 00 87 b2 00 ' +
    '00 00 87 b2 00 00 00 87 b2 00 00 00'

const samples = [
    {
        data: packet,
        parsed: {
            SSRC: 0x73ed0101,
            PT: 99
        }
    }
]


function encode(data) {
    var tokens, buffer, pos = 0;

    if (typeof(data) !== 'string')
        throw new TypeError('data (string) is required');

    tokens = data.split(/\s/);
    buffer = Buffer.alloc(tokens.length);
    for (i in tokens) {
        var t = '0x' + tokens[i];
        var v = parseInt(t);
        buffer.writeUInt8(v, pos++, true);
    }
    return buffer;
}

var rtp = new RTPProtocol()
for (i in samples) {
    samples[i].raw = encode(samples[i].data);
}

describe('basic', () => {

    it('decode_SSRC', () => {
        let res = rtp.decode(samples[0].raw, 'SSRC', 0)
        assert.equal('0x' + res.val.type.toString(16), samples[0].parsed.SSRC)
    })
    it('decode_PT', () => {
        let res = rtp.decode(samples[0].raw, 'PT', 0)
        assert.equal(res.val.type, samples[0].parsed.PT)
    })
})