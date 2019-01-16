# :fish: JavaScript 编码技巧

> 持续更新中...

## 1. Array.includes 与条件判断

一般我们的判断都是用 || 例如：

```JavaScript
    function testFruit(fruit) {
        if(fruit == 'apple' || fruit == 'orange') {
            console.log(`I love it`);
        }
    }
```

如果我们有更多水果,继续使用 *"||"* 代码很累赘，使用Array.includes效果瞬间高大上了。

``` JavaScript
    function testFruit(fruit) {
        const sweetFrutis = ['apple', 'cherry', 'orange', 'banana'];

        if(sweetFrutis.includes(fruit)) {
            console.log(`Sweet fruit`);
        }
    }
```
