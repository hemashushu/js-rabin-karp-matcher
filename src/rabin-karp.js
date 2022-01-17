/**
 * Copyright (c) 2022 Hemashushu <hippospark@gmail.com>, All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
        const base = 256;  // 基数，字符数组当中的每一位字符可视为一个 256 进制的数字，则 256 是一个基数；
        const prime = 101; // 用于取模的质数，防止数值过大溢出。

        // 最高位的权重，值为：
        // Math.pow(base, keywordLength - 1) % prime
        let height = 1;

        // height 的计算也可以使用累乘而得：
        for (let i = 0; i < keywordLength - 1; i++) {
            height = (height * base) % prime;
        }

        let kValue = 0;  // 关键字字符串的 hash 值
        let tValue = 0;  // 被测试字符串当前子字符串的 hash 值

        // 计算初始 Hash
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

    static stringToCodePoints(str) {
        let codePoints = [];
        for (let c of str) {
            codePoints.push(c.codePointAt(0));
        }
        return codePoints;
    }
}

export { RabinKarp };