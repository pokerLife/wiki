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

Set类似于数组结构,但是set成员不能重复.
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
* 字符串去重
```js
  let str = [... new Set('ababc')].join('');
  console.log(str)
  // 'abc'
```
* 另外 Set 是如此强大，因此使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
```js
let arr1 = new Set([1,2,3])
let arr2 = new Set([4,3,2])
// 并集
let union = new Set([...arr1, ...arr2]);
// set {1,2,3,4} 
// 交集
let intersect = new Set([...arr1].filter(x=>{
	return arr2.has(x);
}));
// set {2,3}
// 交集
let intersect = new Set([...arr1].filter(x=>{
	return !arr2.has(x);
}));
// set {1,4}
```
## Map与字典数据类型
ES6 提供了 Map 数据结构。它类似于 Object 对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值，字符串、数值、布尔值、数组、对象等等都可以当作键。
* Map 基本操作
```js
   // 添加
   const resultMap = new Map();
   resultMap.set('0','1111');
   resultMap.set('zhaojie',['1',2]);
   // 获取
   resultMap.get('zhaojie')
   // ["1", 2]
   // 删除
   resultMap.delete('0')
   // true
   // 转换成json
   resultMap.toJSON()
   // [Array(2)]
   // 修改值
   resultMap.set('zhaojie', '1111')
   // Map(1) {"zhaojie" => "1111"}
   // 大小
   resultMap.size
   // 1
   // 清空
   resultMap.clear()
```


