# JavaScript 编码技巧 
 
 * <a href='#1'> Array.includes 与条件判断</a>
 
> 持续更新中:fish: ... 

## 1. Array.includes 与条件判断
<span id='1'><span>

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
## 2.Set去重

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
## 3.Map与字典数据类型
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
Map 的遍历顺序就是插入顺序：
```js
const map = new Map([["F","yes"],["S","no"]]);
for( let key of map.keys()) {
    console.log(key)
} 
// F
// S
for( let value of map.values()) {
    console.log(value)
} 
// yes
// no
```
## 4.函数式的方式处理数据
假设我们有这样的需求，需要先把数组 foo 中的对象结构更改，然后从中挑选出一些符合条件的对象，并且把这些对象放进新数组 result 里。
```js
let foo = [{
        name: "Stark",
        age: 21
    },
    {
        name: "Jarvis",
        age: 20
    },
    {
        name: "Pepper",
        age: 16
    }
];
//我们希望得到结构稍微不同，age大于16的对象：
let result = [{
        person: {
            name: "Stark",
            age: 21
        },
        friends: []
    },
    {
        person: {
            name: "Jarvis",
            age: 20
        },
        friends: []
    }
];
```
通常我们会采用for循环处理，这里我们使用函数式处理效果如下：
```js
let results = foo.filter(personal => {
   return personal.age > 16;
}).map(personal => {
   return {
      personal,
      friend:[]
    }
})
```
* 数组求和
```js
   let arr = [1, 2, 3, 5];
   arr.reduce((a, b) => {
	return a + b;
   });
   // 11
```
## 5.组合 compose
compose，以下将称之为组合：
```js
var compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
/* ES6写法 */
const compose = (f,g) => x => f(g(x));
```
组合看起来像是在饲养函数。你就是饲养员，选择两个有特点又遭你喜欢的函数，让它们结合，产下一个崭新的函数。组合的用法如下：
```js
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = compose(exclaim, toUpperCase);

shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```
## 6.字符串反转
```js
  let str = 'zhaojie';
  [...str].reverse().join('');
```
## 7.使用 Array.from 快速生成数组
一般我们生成一个有规律的数组会使用循环插入的方法，比如使用时间选择插件时，我们可能需要将小时数存放在数组中，现在我们使用Array.form生成：
```js
 let hours = Array.from({ length: 24 }, (value, index) => index + '时');
```
## 8.使用 setTimeout 代替 setInterval
一般情况下我们在项目里不建议使用 setInterval，因为其会存在代码的执行间隔比预期小以及 “丢帧” 的现象，原因在于其本身的实现逻辑。很多人会认为 setInterval 中第二个时间参数的作用是经过该毫秒数执行回调方法，其实不然，其真正的作用是经过该毫秒数将回调方法放置到队列中去，但是如果队列中存在正在执行的方法，其会等待之前的方法完毕再执行，如果存在还未执行的代码实例，其不会插入到队列中去，也就产生了 “丢帧”。

而 setTimeout 并不会出现这样的现象，因为每一次调用都会产生了一个新定时器，同时在前一个定时器代码执行完之前，不会向队列插入新的定时器代码
```js
// 该定时器实际会在 3s 后立即触发下一次回调
setInterval(() => {
    // 执行完这里的代码需要 2s
}, 1000);

// 使用 setTimeout 改写，4秒后触发下一次回调
let doSometing = () => {
    // 执行完这里的代码需要 2s
    
    setTimeout(doSometing, 1000);
}
doSometing();
```
> 延伸阅读：[对于“不用setInterval，用setTimeout”的理解](https://segmentfault.com/a/1190000011282175)
## 9.遍历数组不要使用for in
因为for in 循环会遍历数组原型链，我们无法保证项目不会操作原型链，更加无法确定第三方库，所以还是不要使用for in 遍历数组。
```js
let arr = [1, 2];

for (let key in arr) {
    console.log(arr[key]); // 会正常打印 1, 2
}

// 但是如果在 Array 原型链上添加一个方法
Array.prototype.test = function() {};

for (let key in arr) {
    console.log(arr[key]); // 此时会打印 1, 2, ƒ () {}
}
```
## 10.使用解构
* 不要使用三层及以上解构
> 过多层次的解构会让代码变得难以阅读。
```js
// bad
let {documentElement: {firstElementChild: {nextSibling}}} = window;
```
* 使用解构减少中间变量
> 常见场景如变量值交换，可能产生中间变量。这种场景推荐使用解构。
```js
// good
[x, y] = [y, x];

// bad
let temp = x;
x = y;
y = temp;
```
















