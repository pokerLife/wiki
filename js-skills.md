# JavaScript 编码技巧 
 
> 持续更新中:fish: ... 

## 1. Array.includes 与条件判断

一般我们的判断都是用 || 例如：

```JavaScript
    function testFruit(fruit) {
        if(fruit == 'apple' || fruit == 'orange') {
            console.log(`I love it`);
        }
    }
```

如果我们有更多水果:

``` JavaScript
    function testFruit(fruit) {
        const sweetFrutis = ['apple', 'cherry', 'orange', 'banana'];

        if(sweetFrutis.includes(fruit)) {
            console.log(`Sweet fruit`);
        }
    }
```
## Set去重

Set类似于数组结构：但是set成员不能重复.
* 数组去重

```JavaScript
   const arr = [1,1,5,3,5,3,2];
   const unique = [...new Set(arr)];
   // [1, 5, 3, 2]
```
* Array.form 方法可以将 Set 结构转化为数组,我们可以编写一个去重函数:
```js
   function unique(array) {
      return Array.form(new Set(array));
      // return [...new Set(array)];
   }
   unique([1,1,2,4]) // [1,2,4]
```




