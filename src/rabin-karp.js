/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Rabin-Karp 字符串查找法的简单思想：
 *
 * 1. 在被搜索字符串里，从位置 0 开始取一个跟 **关键字** 一样长的子字符串；
 * 2. 计算子字符串的 Hash 值，如果跟关键字的 Hash 值一样，则说明这个
 *    子字符串 **有可能** 跟关键字相同，使用朴素的方法比较这个字串和关键字，
 *    如果一样则退出搜索过程，如果不一样，则位置右移一位。
 * 3. 重复上面的步骤。
 *
 * 其中：
 *
 * Hash 算法是比较特殊的，它支持滚动更新，当从末尾抛弃一个字符以及从头部压入
 * 一个新字符时，并不需要重新计算这个 "新字符串" 的 Hash 值，而是类似数学的
 * 加减法，把末尾的字符经过某种运算而得的值减去，然后加上新字符的某种运算而得
 * 的值，则刚好为 “新字符串” 的新 Hash 值。
 */
class RabinKarp {

    static find(testStr, keywordStr) {
        let testCodePoints = RabinKarp.stringToCodePoints(testStr);
        let testLength = testCodePoints.length;

        let keywordCodePoints = RabinKarp.stringToCodePoints(keywordStr);
        let keywordLength = keywordCodePoints.length;

        // Hash 值的计算方法大致可理解为：
        //
        // hash(code[0:4]) =
        // (code[0] * 256^4) + (code[1] * 256^3) + (code[2] * 256^2) + (code[3] * 256^1) + (code[4] * 256^0)
        //
        // hash(code[1:5]) = (hash(code[0:4]) - (code[0] * 256^4)) * 256 + (code[5] * 256^0)
        //      ---------     --------------     ----------------    ---   -----------------
        //      新的 hash     旧的 hash 值        末尾字符 * height  左移一位     新字符
        //
        // 其中 height 表示最高位的权重, 比如第 5 位（即索引值为 4） 的权重为 256^4，
        // 公式 height = Math.pow(base, keywordLength - 1)

        // 计算 Hash 值所需要的两个常量
        const base = 256; // 基数，字符数组当中的字符可视为一个 256 进制的数字，则 256 是一个基数；也可以是一个稍微比最大 Unicode 码点 10FFFF 大一些的 2^24。
        const prime = 101; // 用于取模的质数，当基数比较大时，可以取大一些，比如 999979。
        let height = 1; // 最高位的值

        // height 的值为：Math.pow(base, keywordLength - 1) % prime
        //
        // height 的计算也可以使用累乘而得：
        for (let i = 0; i < keywordLength - 1; i++) {
            height = (height * base) % prime;
        }

        let kValue = 0;  // 关键字字符串的 hash 值
        let tValue = 0;  // 被测试字符串当前子字符串的 hash 值

        for (let i = 0; i < keywordLength; i++) {
            kValue = (kValue * base + keywordCodePoints[i]) % prime;
            tValue = (tValue * base + testCodePoints[i]) % prime;
        }

        let idx = 0;
        let count = testLength - keywordLength;

        while (idx < count) {
            if (tValue === kValue) {
                // 当前被测试字符串的子字符串的 hash 值跟关键字的相同，
                // 进一步确认是否真的每个字符都相同。
                // 使用朴素的字符串比较方法，即逐个字符比较
                let checkIdx = 0;
                for (; checkIdx < keywordLength; checkIdx++) {
                    if (testCodePoints[idx + checkIdx] !== keywordCodePoints[checkIdx]) {
                        // 只要有任意一个字符不相同，则断定子字符串跟关键字不同
                        break;
                    }
                }

                if (checkIdx === keywordLength) {
                    // 已确认子字符串跟关键字一致
                    // 中断搜索过程并返回 idx
                    return idx;
                }
            }

            // 计算下一个子字符串的 hash 值
            if (idx < count - 1) {
                tValue = (
                    (tValue - testCodePoints[idx] * height) * base +
                    testCodePoints[idx + keywordLength]) % prime;

                if (tValue < 0) {
                    tValue += prime;
                }
            }

            idx++; // 让下标值向前移动一个字符
        }

        return -1; // 到最后仍未找到关键字。
    }

    /**
     * 使用 "假" 的 hash 算法实现，即简单地将各个字符的 code point 值相加作为 hash 值。
     *
     * 公式：
     * hash[i:i+3] = code[i] + code[i+1] + code[i+2] + code[i+3]
     * hash[i+1:i+4] = hash[i:i+3] - code[i] + code[i+4]
     *
     * 使用这种 hash 值会有较多的碰撞，即会有较大的机率需要进行朴素查找过程，不过单纯的
     * 加法速度较快。
     *
     * @param {*} testStr
     * @param {*} keywordStr
     * @returns
     */
    static findWithFakeHash(testStr, keywordStr) {
        let testCodePoints = RabinKarp.stringToCodePoints(testStr);
        let testLength = testCodePoints.length;

        let keywordCodePoints = RabinKarp.stringToCodePoints(keywordStr);
        let keywordLength = keywordCodePoints.length;

        let kValue = 0;
        let tValue = 0;

        // 单纯地将各个字符的 code point 值相加作为 hash 值
        for (let i = 0; i < keywordLength; i++) {
            kValue = kValue + keywordCodePoints[i];
            tValue = tValue + testCodePoints[i];
        }

        let idx = 0;
        let count = testLength - keywordLength;

        while (idx < count) {
            if (tValue === kValue) {
                // 当前被测试字符串的子字符串的 hash 值跟关键字的相同，
                // 进一步确认是否真的每个字符都相同。
                // 使用朴素的字符串比较方法，即逐个字符比较
                let checkIdx = 0;
                for (; checkIdx < keywordLength; checkIdx++) {
                    if (testCodePoints[idx + checkIdx] !== keywordCodePoints[checkIdx]) {
                        // 只要有任意一个字符不相同，则断定子字符串跟关键字不同
                        break;
                    }
                }

                if (checkIdx === keywordLength) {
                    // 已确认子字符串跟关键字一致
                    // 中断搜索过程并返回 idx
                    return idx;
                }
            }

            // 计算下一个子字符串的 hash 值
            if (idx < count - 1) {
                tValue = tValue -
                    testCodePoints[idx] + // 减去尾部的字符的 code point
                    testCodePoints[idx + keywordLength]; // 加上新压入头部的字符的 code point
            }

            idx++; // 让下标值向前移动一个字符
        }

        return -1; // 到最后仍未找到关键字。
    }

    static stringToCodePoints(str) {
        let codePoints = [];
        for (let c of str) {
            codePoints.push(c.codePointAt(0));
        }
        return codePoints;
    }
}

export { RabinKarp };