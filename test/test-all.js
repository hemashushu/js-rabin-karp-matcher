/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { strict as assert } from 'assert';

import { RabinKarp } from '../src/rabinkarp.js'

function testFind() {
    let s = 'ababbbabbbabaababaaabaaaaabababaabcdabdbabab';

    let k1 = 'abaab';
    assert.equal(RabinKarp.find(s, k1), s.indexOf(k1));

    let k2 = 'aaaab';
    assert.equal(RabinKarp.find(s, k2), s.indexOf(k2));

    let k3 = 'aabaaa';
    assert.equal(RabinKarp.find(s, k3), s.indexOf(k3));

    let k4 = 'abcdabd';
    assert.equal(RabinKarp.find(s, k4), s.indexOf(k4));
}

function testFindWithFakeHash() {
    let s = 'ababbbabbbabaababaaabaaaaabababaabcdabdbabab';

    let k1 = 'abaab';
    assert.equal(RabinKarp.findWithFakeHash(s, k1), s.indexOf(k1));

    let k2 = 'aaaab';
    assert.equal(RabinKarp.findWithFakeHash(s, k2), s.indexOf(k2));

    let k3 = 'aabaaa';
    assert.equal(RabinKarp.findWithFakeHash(s, k3), s.indexOf(k3));

    let k4 = 'abcdabd';
    assert.equal(RabinKarp.findWithFakeHash(s, k4), s.indexOf(k4));
}

function testRabinKarp() {
    testFind();
    testFindWithFakeHash();
    console.log('testRabinKarp() passed.');
}

(() => {
    testRabinKarp();
})();