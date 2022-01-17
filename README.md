# JS Rabin-Karp Matcher

简单的 Rabin-Karp 算法（即 "拉宾-卡普" 算法）的实现，用于学习之目的，代码当中有每一部分的详细说明。

## 算法简介

Rabin-Karp 是一种字符串搜索算法。字符串搜索是指在 `目标字符串` 里搜索指定 `关键字` 所出现的位置，比如在各种文本编辑器里使用 "查找" 功能就是字符串搜索。

### 简单思想

1. 在 `目标字符串` 的开始位置里取一个跟 **关键字** 一样长的子字符串；
2. 计算子该字符串的 Hash 值，如果跟 `关键字` 的 Hash 值一样，则说明这个子字符串 **有可能** 跟关键字相同，再使用暴力搜索法比较这个字串和关键字，如果一样则表示已经找到匹配的字符并退出搜索过程，如果不一样则从 `目标字符串` 里的下一个字符开始重复第一步。

Rabin-Karp 算法的 Hash 计算方法跟常见的 SHA、MD5 等 Hash 算法不同，它是一种简单得多且支持 `滚动更新` 的算法。所谓 `滚动更新` 是指：当从末尾抛弃一个字符以及从头部压入一个新字符时，并不需要重新计算这个 "新字符串" 的 Hash 值，而是类似数学的加减法，把末尾的字符（经过某种运算而得）的值减去，然后加上新字符（经过某种运算而得）的值，则刚好为 "新字符串" 的 Hash 值。

不妨把 Rabin-Karp 算法的 Hash 计算方法假想为目标字符的 Unicode 码点相加。

比如对于字符串从位置 0 到位置 3 的 Hash 值为：

`hash(code[i:i+3]) = code[i] + code[i+1] + code[i+2] + code[i+3]`

那么当把位置往右移动一位时，即 位置 1 到位置 4 的 Hash 值为：

`hash(code[i+1:i+4]) = hash(code[i:i+3]) - code[i] + code[i+4]`

如此一来即实现了 `滚动更新`。

但实际上 Rabin-Karp 算法的 Hash 计算方法并不是简单地把字符的 Unicode 码点相加，因为对于小字符集（比如英文字母）这样出现 Hash 碰撞的机率较高；当然也不会太复杂，否则计算 Hash 的成本远远高于字符串比较的成本。所以它的 Hash 计算方法是：

`hash(code[0:4]) = (code[0] * 256^4) + (code[1] * 256^3) + (code[2] * 256^2) + (code[3] * 256^1) + (code[4] * 256^0)`

它的算法把连续字符中的每一位当成是一个 `256` 进制的数（因为英文每个字母使用一个 byte 存储，一个 byte 是值从 0 到 255 共 256 个值的自然数），然后 Hash 值就是把这个 `256` 进制的数转成的十进制数。所以当字符串 `code[1:5]` 的 Hash 值就是：

```text
hash(code[1:5]) = (hash(code[0:4]) - (code[0] * 256^4)) * 256 + (code[5] * 256^0)
---------------   ----------------    ----------------    ---    ----------------
   新的 Hash 值     上一个 Hash 值      末尾字符 * height  左移一位     新字符
```

上面的 `height` 为最高位的权重，值为 `Math.pow(256, keywordLength - 1)`

在实际程序里，因为 `关键字` 的长度可能很长，导致高位的权重值超出整型甚至长整型数字能表示的范围，所以通常还需要对每一个乘法计算的结果使用一个素数进行 `取余`。

比如计算从 0 到 keywordLength 的 Hash 值，代码如下：

```javascript
const base = 256; // 基数
const prime = 101; // 素数

let hash = 0;  // Hash 值的初始值

for (let i = 0; i < keywordLength; i++) {
    hash = (hash * base + code[i]) % prime;
}

console.log(hash);
```

## 单元测试

执行命令：

`$ npm test`

应该能看到 `testRabinKarp() passed.` 字样。

## 单步调试/跟踪

有时跟踪程序的运行过程，能帮助对程序的理解，启动单步调试的方法是：

在 vscode 里打开该项目，然后在单元测试文件里设置断点，再执行 `Run and Debug` 即可。


## 字符串搜索算法系列项目

- JS Rabin-Karp Matcher
  https://github.com/hemashushu/js-rabin-karp-matcher

- JS Boyer-Moore-Horspool Matcher
  https://github.com/hemashushu/js-boyer-moore-horspool-matcher

- JS KMP Matcher
  https://github.com/hemashushu/js-kmp-matcher

- JS Aho-Corasick Matcher
  https://github.com/hemashushu/js-aho-corasick-matcher

- JS Regexp Interpreter
  https://github.com/hemashushu/js-regexp-interpreter
