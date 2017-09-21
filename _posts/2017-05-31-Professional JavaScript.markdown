---
layout: post
title:  "读《JavaScript高级程序设计》笔记"
date:   2017-05-31
categories: 
excerpt:  "" 
---

#### 目录
1. <a href="#1">Day1 相等符(==)<a/>
2. <a href="#2">Day2 包装对象<a/>
3. <a href="#3">Day3 从闭包来看作用域<a/>
4. <a href="#4">Day4 参数传递是引用传递?不存在的<a/>
5. <a href="#5">Day5 追寻js的本质、历史、局限性<a/>
6. <a href="#6">Day6 散落在缝隙里的基本概念<a/>
7. <a href="#7">Day7 作用域、内存问题<a/>
8. <a href="#8">Day8 探路引用类型<a/>
9. <a href="#9">Day9 引用类型完结篇性<a/>
10. <a href="#10">Day10 面向对象的程序设计<a/>
11. <a href="#11">Day11 函数作用域<a/>
12. <a href="#12">Day12 BOM和客户端检测<a/>
13. <a href="#13">Day13 DOM<a/>
14. <a href="#14">Day14 事件(一)<a/>
15. <a href="#15">Day15 事件(二)<a/>
16. <a href="#16">Day16 表单<a/>
17. <a href="#17">Day17 错误处理<a/>
18. <a href="#18">Day18 JSON<a/>
19. <a href="#19">Day19 AJAX(一)<a/>
20. <a href="#20">Day20 AJAX(二)<a/>
21. <a href="#21">Day21 高级技巧<a/>
22. <a href="#22">Day22 最佳实践-可维护性<a/>
23. <a href="#23">Day23 HTML5——File API<a/>

<a id="1" href="javascript:void(0)"></a>
### Day1 相等符(==)
过去的某一天里，突然看到了一篇叫做[《如何通过饿了吗NodeJS面试》](https://github.com/ElemeFE/node-interview/tree/master/sections/zh-cn)的文章，里面提了几个关于js的基础问题，看后却没有一点头绪，我想确实该补一下知识了，那就打开犀牛书，每天记录一点吧!
{% highlight javascript %}  
    问题一:  
    temp==undefined?   // 报错  
    问题二:  
    [1]==[1]?           // false
    问题三:  
    undefined==null?    // true
{% endhighlight %}  

印象中的`==`，是判断值是否相等，使用`==`时，如果类型不同，js会先去做类型转换，然后再比较值，但如果值本身是null或undefined的话就不会去执行类型转换了。

先看第一个问题，一不小心确实会以为结果为`true`了?`temp`确实未定义，但在这之前还未声明  

第二个问题，在做`==`比较时，如果两个运算数都是对象，则需要比较他们的引用值，左右两边并不是引用的同一个对象，所以为`false`  

最后一个问题，JS规定了`undefined==null`为`true`，它们的使用方式很相近，在`if`判断里都会转化为`false`，理解这个问题，需要追溯到js的设计之初来理解，这里参考阮一峰老师的[文章](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
> 1995年JavaScript诞生时，最初像Java一样，只设置了null作为表示‘无’的值。
  根据C语言的传统，null被设计成可以自动转为0。  
  但是，JavaScript的设计者Brendan Eich，觉得这样做还不够，有两个原因。  
  首先，null像在Java里一样，被当成一个对象。但是，JavaScript的数据类型分成原始类型（primitive）和合成类型（complex）两大类，Brendan Eich觉得表示‘无’的值最好不是对象。  
  其次，JavaScript的最初版本没有包括错误处理机制，发生数据类型不匹配时，往往是自动转换类型或者默默地失败。Brendan Eich觉得，如果null自动转为0，很不容易发现错误。  
  因此，Brendan Eich又设计了一个undefined。
  
  
<a id="2" href="javascript:void(0)"></a>
### Day2 包装对象
  
  {% highlight javascript %}  
      问题:  
      var s = "test";
      s.len = 4;
      console.log(s.len);   // ?
  {% endhighlight %}  
  我们经常遇到这样一种情况，使用字符串的`.length`属性来获取到一个字符串的长度，像这样
  {% highlight javascript %}  
      var s = "test";
      console.log(s.length);
  {% endhighlight %}  
  可是`s`明明是一个字符串，又不是对象，为什么会有属性?原来，只要引用了`s`的属性，`JavaScript`就会将字符串通过`new String(s)`的方式转换为对象，这个对象继承了字符串的方法，并用来处理属性的引用。一旦引用结束，这个新创建的对象就会被销毁。  
  
  所以在问题一里，第二行代码创建了一个临时字符串对象，在给其属性`len`赋值完毕后就被销毁，第三行代码又会新建一个字符串对象，但`s.len`只声明，没有定义，所以结果为`undefined`。同字符串一样，数字和布尔值也有它们自己的包装对象`Number()`和`Boolean()`。`null`和`undefined`没有包装对象，访问其属性会返回一个类型错误。
   

<a id="3" href="javascript:void(0)"></a>
### Day3 从闭包来看作用域

js里的闭包，简单来说就是`在函数内部定义一个函数`
{% highlight javascript %}  
    function say1() {
        var test = 'hello';
        var say2 = function(){
            alert(test);
        }
        return say2;
    }
    var said = say1();
    said();
{% endhighlight %}  
像这样，我们通过返回的`say2`方法在外部获取到函数内部的`test`变量。这是闭包的第一个用途，`在函数外部读取函数内部的变量`。
今天主要是记录另一个用途，`让变量始终保存在内存中`。先看例子:
{% highlight javascript %}  
    function say1(){
        var n = 333;
        nAdd = function() {
            n += 1;
        }
        function say2() {
            alert(n);
        }
        return say2;
    }
    var said = say1();
    said();     //333
    nAdd();
    said();     //334
{% endhighlight %} 
从结果里我们看到，执行了两次闭包函数`say2`，第一次结果为`333`，第二次为`334`，`n`作为`say1`的局部变量，并没有在函数调用完后被清除掉。原因在于`say1`是`say2`的父函数，但`say2`被赋给了全局变量`said`，这导致`say2`会始终在内存中，而`say2`依赖于`say1`，因此`say1`也会在内存中，不会被GC(垃圾回收机制)回收。  

查了一下资料，大概了解了一下GC，得出如下总结:   

   `为了避免内存泄漏，语言引擎会释放内存中不再引用的资源，通常是用一张"引用表"来记录内存中所有资源的引用情况.如果一个值引用数为"0"，那么这块内存就会被释放.引用类型是在没有引用之后，会被GC自动回收，如果是处于闭包中值类型，则要等闭包没有引用时才会被回收.`
   
这样也就可以从根本上来解释变量`n`依然保存在内存中的原因了。

<a id="4" href="javascript:void(0)"></a>
### Day4 参数传递是引用传递?不存在的

照例先看个问题:  
{% highlight javascript %}
function setName(obj){
    obj.name = "bulger";
    obj = new Object();
    obj.name = "admin";
}
var person = new Object();
setName(person);
alert(person.name);     //? bulger
{% endhighlight %} 
好尴尬，又猜错了，这是为什么呢?我们慢慢来分析。  

js的变量包含两种数据类型:基本数据类型和引用数据类型。我们分别来看用这两种数据类型作为参数传递时的情况。  

①基本数据类型:
{% highlight javascript %}
function add(num){
   num+=10;
   return num;
}
num=10;
alert(add(num));    //20
aelrt(num);         //10
{% endhighlight %} 
对于这个结果是不是也挺吃惊的。原来，在进行基本类型参数传递的时候，做了一个复制栈帧的拷贝动作，这样使得外部变量`num`和函数参数`num`具有了相同的值，但是它们参数地址完全不同，在函数调用结束后回收该栈帧，这种机制一定程度上避免了内存泄漏。所以改变了函数参数`num`，并不会对外部的变量`num`有影响。  

②引用数据类型:
{% highlight javascript %}
function setName(obj){
    obj.name="bulger";
}
var obj=new Object();
setName(obj);
alert(obj.name);
//bulger
{% endhighlight %} 
以上代码运行时，首先把新创建的Object对象的引用赋值给了obj，在进行参数传递时，同上一个方法一样，复制出一个栈帧给参数obj，使得两者拥有相同的值(`Object对象的引用地址`)，然后在setName做改变的时候，实际上改变了Object对象的值，改变完成后弹出该栈帧。那这样是否就可以得出js里的函数参数传递机制有`值传递`和`引用传递`两种方式了呢?

不一定。先来看看函数参数传递机制的两种定义。
> 函数参数传递机制问题在本质上是调用函数（过程）和被调用函数（过程）在调用发生时进行通信的方法问题。基本的参数传递机制有两种：值传递和引用传递。以下讨论称调用其他函数的函数为主调函数，被调用的函数为被调函数。   
    　　值传递（passl-by-value）过程中，被调函数的形式参数作为被调函数的局部变量处理，即在堆栈中开辟了内存空间以存放由主调函数放进来的实参的值，从而成为了实参的一个副本。值传递的特点是被调函数对形式参数的任何操作都是作为局部变量进行，不会影响主调函数的实参变量的值。   
    　　引用传递(pass-by-reference)过程中，被调函数的形式参数虽然也作为局部变量在堆栈中开辟了内存空间，但是这时存放的是由主调函数放进来的实参变量的地址。被调函数对形参的任何操作都被处理成间接寻址，即通过堆栈中存放的地址访问主调函数中的实参变量。正因为如此，被调函数对形参做的任何操作都影响了主调函数中的实参变量。

从①例子里可见，基本数据类型的参数传递是属于值传递的。我们回到一开始的那个问题里:在没有重新定义obj之前，变量person和函数参数obj的值相等，都是对同一个对象的引用地址，执行第一个`obj.name = bulger`时，也会改变原对象的值，但在重新定义obj后，其引用的对象已经和person不同，所以后面设置的name属性，不会再对原对象有影响。即不满足函数参数引用传递机制的定义:`被调函数对形参做的任何操作都影响了主调函数中的实参变量`，因此得出结论:`js里的函数参数传递不存在引用传递，只有值传递`。

<a id="5" href="javascript:void(0)"></a>
### Day5 追寻js的本质、历史、局限性

#### 一、JavaScript简史  
在Web刚兴起的时候，网速普遍都是28.8kbit/s，所以出现这么一个场景，“用户填写完一个表单，点击提交按钮，30秒过后服务器返回消息说有一个必填字段没有填写”。  

为了解决在客户端实现简单验证的问题，Netscape公司的Brendan Eich在1995年开发了出了LiveScript，发布前夕，为了搭上媒体炒热Java顺风车，临时改名为JavaScript。  

由于JavaScript发布后获得了巨大的成功，其它浏览器开发商也都做出了能在自己浏览器上运行的JavaScript版本，当时还没有标准规定JavaScript的语法和特性，所以在1997年的时候，出台了一个叫做ECMAScript的新脚本语言的标准。

#### 二、JavaScript的实现
JavaScript由以下三部分组成。
##### 1.ECMAScript
ECMAScript和Web浏览器没有任何依赖。它只是定义了一些基础，在此基础之上可以构建完善的脚本语言。常见的Web浏览器只是实现ECMAScript的宿主环境之一，类似的还有Node和Adobe flash。宿主环境不仅提供了基本的ECMAScript实现，还会提供该语言的拓展，如浏览器的DOM，Node的I/O。  
`ps:按照标准实现宿主环境这种形式，让我想起了《黑客与画家》里提及的Lisp语言，约翰·麦卡锡一开始并不是想把Lisp设计成编程语言，是他的学生拉塞尔实现的Lisp解释器。但Lisp包含一些思想今天我们早已习以为常，比如条件结构(if-then-else)、递归、垃圾回收机制，那是1958年提出的呀我的老爷`  
ECMAScript的重要版本:  
* `ECMAScript 3: 新增正则表达式、try-catch异常处理`
* `ECMAScript 4: 改动太大，被毙掉(居然提出强类型变量)`
* `ECMAScript 5: 新增JSON对象、严格模式`  

IE的兼容虽然备受诟病，但却是第一个实现ECMAScript5的主流浏览器...  
##### 2.DOM(文档对象模型)
DOM是针对XML经过拓展后用于HTML应用程序的编程接口。DOM使得整个HTML页面中的每个组成部分都是某种类型的节点，借助DOM提供的API，开发人员可以删除、添加、修改这些节点(虽然现在的开发模式已经不是直接操作DOM了，不过还是怀念那种直来直去的感觉，说爱你就跟我走)。  

扯皮的是，起初Netscope和微软对DOM实现在各自浏览器上的情况又是互不兼容，所以w3c就跳出来规划了一个DOM标准。

##### 3.BOM(浏览器对象模型)
所有对于浏览器JavaScript的拓展都可以算作是BOM的一部分，为什么这么笼统?因为在HTML5之前依然没有一个BOM的标准被提出来，导致很多浏览器都有自己的实现。HTMl5致力于把很多BOM功能纳入规范，这个我们后续再说。

#### 三、小结
作为一种专为网页交互而设计的脚本语言，JavaScript由以下三个部分组成:
* `ECMAScript`
* `DOM(文档对象模型)`
* `BOM(浏览器对象模型)`

这三者在目前的五个主流浏览器(IE、Chrome、Firefox、Safari和Opera)中得到不同程度的支持，`ECMAScript3`基本支持，`ECMAScript5`还有部分未支持;对DOM结构彼此相差还是很大;BOM尽管在各个浏览器都实现了某些众所周知的功能，如window对象、navigator对象，其他特性还是会因浏览器各异。

<a id="6" href="javascript:void(0)"></a>
### Day6 散落在缝隙里的基本概念

大概算了一下，今天看js的基本核心概念花了5个小时左右，这些概念实现了ECMAScript的标准，可以说是很枯燥了，讲数据类型，讲语句，讲函数，10点的时候还看瞌睡了，赶紧打开音乐听逼哥吼两嗓子。幸好能拾得以下这些遗漏的点，才算这波不亏。果然，新鲜感才是让我活下去的动力。
#### 1、typeof、undefined、null
* `typeof 是唯一一个可以用于未声明变量而不报错的操作符(虽然delete也可以，但是没有任何意义，且在严格模式下会报错)`
* `typeof null   //结果是object。因此null也经常被作为一个对象占位符，表示这个变量将来会用于保存对象。`
* `undefined == null    //true。undefined派生自null，因此ECMAScript规定它们的相等性测试要返回true。`

#### 2、数值类型
##### ① 浮点数值
{% highlight javascript %}  
    0.1 + 0.2 == 0.3    //false
{% endhighlight %} 
真实结果是`0.30000000000000004`，这个问题出在JavaScript的数值类型采用的是IEEE 754 64位双精度浮点数编码上，有时间再去研究。避免方法就是不要测试某个特定的浮点数值。  
##### ② 数值范围
由于内存的限制，JavaScript也只能保存一定范围内的值，使用`Number.MIN_VALUE`可以拿到最小值，`Number.MAX_VALUE`拿到最大值。`isFinite()`函数可以判断一个数是否在范围之间。
 {% highlight javascript %}  
     var result = Number.MAX_VALUE + Number.MAX_VALUE;
     alert(isFinite(result));   //false
 {% endhighlight %}  
#### 3、逗号操作符
用于在一行语句中执行多个操作
{% highlight javascript %}  
    var num = (1, 5, 2, 7, 3);
    alert(num);    //num = 3;
{% endhighlight %} 
#### 4、label语句
使用label语句添加给标签，配合循环语句用，实例:
{% highlight javascript %}  
    var num = 0;
    outermost:
    for(var i=0; i < 10; i++) {
        for(var j=0; j < 10; j++) {
            if (i == 5 && j == 5) {
                break outermost;
            }
            num++;
        }
    }
    alert(num);     //55
{% endhighlight %} 
因为`break`语句不仅退出了当前循环，直接退出了设置标签为outermost的这层循环。  
#### 5、函数参数
都知道函数的参数可以用`arguments`对象来获取。有意思的是，`arguments`会永远和对应命名参数的值保持一致，且这种流动是双向的。实例:
{% highlight javascript %}  
    function doAdd1(num) {
        alert(num);     //1
        arguments[0] = 10;
        alert(num);     //10
    }
    doAdd1(1);
    function doAdd2(num) {
        alert(arguments[0]);     //1
        num = 10;
        alert(arguments[0]);     //10
    }
    doAdd2(1);
{% endhighlight %} 

还有一些如`with`语句这样的不常用的且在大型应用并不适用的就不细说了。明天接着作用域、内存管理，应该会好玩多。

<a id="7" href="javascript:void(0)"></a>
### Day7 作用域、内存问题

#### 一、执行环境和作用域链

执行环境定义了函数或变量能有权访问的其他数据，全局环境是最外围的一个环境，且每一个函数都有一个执行环境，而每一个执行环境，都有一个与之对应的对象变量保存这些数据，供解析器使用。当执行流从最外围进入到一个函数的时候，函数的环境被推入一个环境栈中，执行完后弹出该栈，控制权继续返回之前运行的环境。

代码在一个环境中运行时，会创建一个作用域链，它的用途是保障有权访问的变量或函数的`有序访问`，作用域链的前端，是当前代码执行环境的变量对象。它的下一个变量对象来自包含它的环境，以此类推，全局执行环境的变量始终是作用域链的最后一个对象。

标识符(变量)的解析就是沿着作用域链一级一级的向上搜索的过程。从最前端开始，逐级查找，找到就会停止，所以`局部变量会覆盖全局的同名变量`、`访问局部变量比访问全局变量快`。如果连全局环境都找不到，则意味着该变量未申明。

#### 二、垃圾回收
JavaScript会周期性的监测出执行环境中不再使用的内存，然后释放掉。浏览器中具体有两种实现。  
1.引用计数  
含义就是记录每一个值被引用的次数。把一个引用类型值或是基本类型值赋给一个变量，该值的引用次数加1，包含对该引用的变量又取到了另外一个值，则这个值引用次数减1。引用次数为0是，就会在下一次垃圾回收器运行时，释放那个值所占的内存。  
这种方式有一个严重的问题(IE8以下会出现)，循环引用:
{% highlight javascript %}  
    function problem() {
        var objA = new Object();
        var objB = new Object();
        
        objA.attr = objB;
        objB.attr = objA;
    }
{% endhighlight %} 

函数结束时objA和objB的引用数永远是都是2，所以不会被采用这种回收机制的浏览器所清除掉。  

2.标记清除  
垃圾回收器会在运行时给内存中的所有变量都打上标记，然后再去掉执行环境中的变量和被执行环境中的变量所引用的变量的标记，由于环境中的变量已经无法再访问这些被标记的变量了，这些变量将在下一次垃圾回收器工作时被回收。

现代浏览器基本都使用标记清除的方式来做垃圾回收，但这样也不是完美的。标记清除的后的内存空间是不连续的，后来又出现了基于标记清除的改进版，标记-整理方法，该方法会在做标记的时候把`活着`的内存尽量移动到一边，清除时再释放边界部分，不过这样的效率没有标记清除高，反正浏览器给什么就用什么吧~

#### 三、管理内存
为了避免运行JavaScript的网页导致系统崩溃，所以分配给Web浏览器的内存有限。因此，优化内存可以让页面获得更好的性能。
* 解除引用:手动清除不再使用的全局对象、全局对象属性及循环引用变量的引用
* 不需要`interval`或者`timeout`时，最好调用`clearInterval`或者`clearTimeout`
* 避免创建对象，类似于`var obj = {};`，可以在使用到的时候再直接赋值。使用`array.length = 0`清空数组

<a id="8" href="javascript:void(0)"></a>
### Day8 探路引用类型

#### 一、数组
##### 1、位置方法
indexOf和lastIndexOf是通过全等于(`===`)来查找匹配的
{% highlight javascript %}  
    var person = { name: 'Tom' };
    var people = [{ name: 'Tom' }];
    
    var morePeople = [person];
    alert(people.indexOf(person));  //-1
    alert(morePeople.indexOf(person));  //0    
{% endhighlight %} 
且lastIndexOf是从末尾开始。
##### 2.迭代方法
* every():对数组中的每一项运行给定函数，如果该函数每一项都返回true，那就返回true
* some():对数组中的每一项运行给定函数，如果该函数至少有一项返回true，那就返回true
* filter():对数组中的每一项运行给定函数，返回该函数会返回true的项组成数组  

用来用去都是map和forEach，还有这几个好用的方法，留意下。
#### 二、有趣的Date对象
提到`Date`对象就是一大堆的方法，前端和它常打交道的场景通常是做日期范围查询传递数据给后端。恰好刚才发现了一个有趣的地方。

使用`Date.parse()`方法可以把一个表示日期的字符串转换为相应的毫秒数，如:
{% highlight javascript %}  
    Date.parse('2017-06-8');     //1496851200000 
    Date.parse('2017-6-08');     //1496851200000 
    Date.parse('2017-6-8');      //1496851200000
    Date.parse('2017-06-08');    //1496880000000
    (1496880000000 - 1496851200000)/(1000 * 3600);  //8
{% endhighlight %} 
可以看到，前三种使用非`yyyy-mm-dd`格式的字符串，得到的返回值比使用`yyyy-mm-dd`格式得到的时间值少了8小时，格林威治作为世界时间，比中国的本地时间慢了8小时，因此我推测`yyyy-mm-dd`格式的字符串通过`Date.parse()`得到的是中国时间，否则就是世界时间。在真实的使用场景中，只要保证两端取同一个时区的时间来计算，也就不会出现误差了。

#### 三、正则表达式-IE9以下的问题
使用字面量`/example/g`定义的正则表达式始终会共享一个实例，循环使用时可能会与预期出现误差，需注意。

#### 四、arguments的属性-callee
`callee`是对象`arguments`对象的一个属性，保存了拥有这个`arguments`的函数。

`callee`有一个属性`callee.caller`，保存着调用当前函数的函数引用，如果是在全局作用域中调用该函数，该值为`null`。

这两点在给函数名解耦时(递归)很有用。

#### 五、函数的属性和方法
##### 1.属性
* length:表示函数希望接收的参数个数
* prototype:保存所有的实例方法

##### 2.方法
apply()和call()，它们都是都是用来改变函数体内的`this`值，区别在于所接收的参数不同，它们第一个参数都接收要运行的作用域，不同的是call()`传递的第二个参数必须逐个列出来，而`apply()`的第二个参数可以是数组Array的实例。  
通过`apply()`方法可以解析Array实例的特性，有了以下的两个黑科技:
* Math.max.apply(null， `array`)  //得出数组`array`的最大值
* Array.prototype.push.apply(`arr1`， `arr2`);  //合并`arr1、arr2`数组

<a id="9" href="javascript:void(0)"></a>
### Day9 引用类型完结篇

如果标题取名以“你不知道”开头的话，那可能会写出30+篇出来。一开始我是通过W3C的中文手册来学习的，现在也常用它来当做手册查询。所以，我是拿了一个速查的手册在学习，并没有深入的理解，结果现在在书里看到的除了基础讲解，甚至连一些语言内置提供的方法也觉得新鲜。所以下次再学习新语言的时候还是直接看书实在点，否则早晚是要补回来的。  

现在对于做记录也有了一点个人的想法。

以前老师告诉我们"理解一个东西，你需要把它转化成自己的语言表述出来"，有模有样的学习背后，连做记录都是用自己的语言了，可是呀，写作者的语言凝练水平，不知道比我们高到哪里去，因此，概念性的解释，还是用作者的原句比较好。
#### 一、基本包装类型
前面写过一点[包装类型的常用实践](https://bulgerxie.github.io/%E6%88%91%E5%8F%AF%E8%83%BD%E4%B8%8D%E4%BC%9Ajavascript/2017/06/01/Notjs-day2.html)，这里就不多说了。现在记录一些内置提供的方法。
* Number类型提供了`toFixed()`，该方法会返回指定小数位的数值字符串，接收一个指定位数的参数:
{% highlight javascript %}  
    var num = 30;
    alert(num.toFixed(2));  //"30.00"
{% endhighlight %} 
妈妈笑了，儿子再也不用担心货币操作的小数点位数了
* String类型提供的`replace()`方法，用于替子字符串，第一个参数为匹配项的字符串或是一个正则表达式，第二个参数为用于替换的字符串或者一个函数。简单地操作使用传入字符串就行，想要定制化的替换，可以试试传入函数的形式。
{% highlight javascript %}  
    function htmlEscape(text) {
       return text.replace(/[<>"&]/g, function(match, pos, originalText) {
            switch(match) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case "&":
                    return "&amp;";
                case "\"":
                    return "&quot;";
            }
       });
    }
    alert(htmlEscape("<span class=\"color\">hello</span>"));
    //&lt;span class=&quot;color&quot;&gt;hello&lt;/span&gt;
{% endhighlight %} 
如果以函数作为第二个参数，该函数可以传入三个参数，分别为匹配项、匹配项在字符串中的位置和原始字符串。
#### 二、单体内置对象
引用书中对单体内置对象的定义:
> 由ECMAScript实现提供、不依赖于宿主环境的对象，这些对象在ECMAScript程序执行之前就存在了。

它实现了两个单体内置对象:Global个Math。
##### 1.Global
这个对象被认为是一个`兜底对象`，因为所有在全局作用域中定义的函数和方法，都是Global对象的属性，在浏览器中挂载到`window`对象上。诸如`Infinity`属性和`isNan()`、`parseInt()`方法。  

值得一提的是，在使用全局方法eval()来执行JavaScript代码时，它所定义的内部变量不会出现变量提升。
##### 2.Math
至于Math对象，提供了很多辅助方法用于完成数学计算，记熟就行。  

看到一个实践不错:
{% highlight javascript %}  
    function selectForm(lowerValue, upperValue) {
        var choices = upperValue - lowerValue + 1;
        return Math.floor(Math.random() * choices + lowerValue);
    }
    var num = selectForm(2, 10);
    alert(num);     //num >= 2 && num <= 10  
{% endhighlight %} 
像这样做记录的代码，不是不能把它定义成自己的代码风格，但我没法比它做到更具语义化的定义，copy就好。

<a id="10" href="javascript:void(0)"></a>
### Day10 面向对象的程序设计

#### 一、访问器属性getter和setter
这个属性第一次相见时，并没有意识到有多大的用处，认为只是语言的一些内部实现方法，殊不知到今天，各种流行的MVVM框架都是依赖于它做数据绑定。  

对象的属性在创建时，都会带有一些特征值，数据属性和访问器属性，今天主要记录访问器属性`getter`和`setter`。
* getter:在读取函数时调用的函数，default:undefined
* setter:在设置函数时调用的函数，default:undefined  

这些属性不能直接定义，需要使用`Object.defineProperty()`来定义，该方法接收三个参数，属性所在的对象、属性的名字和一个描述符对象。其中，描述符对象的属性必须是:configurable、enumberable、writable和value。  

常用的使用访问器属性方式如下所示，即设置一个属性的值会导致另一个属性发生变化。
{% highlight javascript %}  
var book = {
    _year:  2004,
    edition: 1
}
Object.defineProperty(book, "year", {
    get: function() {
        return this._year;
    },
    set: function(newValue) {
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    }
});
book.year = 2005;
alert(book.edition);    //2
{% endhighlight %} 
#### 二、继承
对于这个主题，我看过不止4遍了，真正让我觉得通透的是返校拿毕业证那会儿，在图书馆里看到了一本薄薄的《Javascript面向对象精粹》，花了两天看完，深入简出，很是喜欢，后来还买了一本送朋友。
##### 1.构造函数继承
使用call或apply在子类的构造函数中执行一遍父类的构造函数，并改变this指向为子类。缺点是每实例一个对象都会执行一遍父类的构造函数。
##### 2.prototype模式
把子类的prototype属性指向父类的实例，切记要修改constructor的指向。缺点是每次都要实例化一下父类，占用内存。
##### 3.直接继承prototype
把子类的prototype属性指向父类的prototype属性，同样要修改constructor属性的指向，缺点是子类的prototype修改会影响到父类的prototype。
##### 4.利用空对象作为媒介
使用一个空对象的prototype指向父类的prototype，然后再用子类的prototype指向空对象的prototype，这样就避免了第3中方式的缺点。
##### 5.拷贝继承
把父类的prototype上的属性和方法拷贝到子类的prototype。

非构造函数的继承有object()方法、浅拷贝和深拷贝

<a id="11" href="javascript:void(0)"></a>
### Day11 函数作用域

#### 一、闭包中的内存泄漏
由于闭包会引用包含函数的整个活动对象，导致在以引用计数作为垃圾回收策略的浏览器上出现内存泄漏问题，类似下面这样:
{% highlight javascript %}
    function assignHandler() {
        var element = document.getElementById(someElement);
        element.onclick = function() {
            alert(element.id);  
        };
    }
{% endhighlight%}
闭包内引用了`element`，所以在函数执行完后element还是会继续保存在内存中，即使闭包没有直接引用到`element`，也会使得`element`元素不会被回收，因为包含闭包的`assignHandler`活动对象已经在闭包的作用域链上了。
#### 二、递归函数
在递归函数中，要始终使用arguments.callee来递归地调用自身，不要使用函数名，因为函数名可能会发生变化。
{% highlight javascript %}
    function factorial(num) {
        if (num < 1) {
            return 1;
        } else {
            return num * arguments.callee(num - 1);
        }
    }
{% endhighlight%}
#### 三、用函数作用域实现模块模式
[《JS中常用的4种设计模式》](https://bulger-model.herokuapp.com/#/overview)

<a id="12" href="javascript:void(0)"></a>
### Day12 BOM和客户端检测

#### 一、BOM
##### 1.window对象—间隙调用和超时调用
第一个参数尽量别使用字符串，可能会导致性能损失。改用:
{% highlight javascript %}
    setTimeout(function() {
        alert(1);
    },1000);
{% endhighlight %}
##### 2.location对象—位置函数
* location.assign()
* window.location()
* location.href()
* location.replace()，这个方法同以上三个方法一样，都可以改变url，区别是它不会被记入浏览器历史记录
* location.reload()     //重新加载，如果页面自上次请求过后没有改变过，即从缓存加载，否则重新加载
* location.reload(true)     //强制重新加载  

##### 3.history对象
可以使用`location.back()`和`location.forward()`代替`location.go()`来实现页面的前进和后退，更具语义化一点。  
#### 二、客户端检测
* 能力检测:检查特定浏览器的能力。例如，在调用某个函数之前，检测该函数是否存在
* 怪癖检测:检测浏览器是否有bug。
* 用户代理检测:通过检查用户代理字符串来识别浏览器。

使用优先级:能力检测 > 怪癖检测 > 用户代理检测  

现在我们可以使用Modernizr.js来对浏览器所支持特性的做检测，根据检测出的结果来做相应的hack。

<a id="13" href="javascript:void(0)"></a>
### Day13 DOM

#### 一、DOM
##### 1.document
* `document.URL`  返回当前的url
* `document.domain`  返回当前的域名
* `document.referrer`  返回当前页面的来源页url，没有则返回null

##### 2.为什么说DOM操作是"昂贵"的?
原来，nodeList对象保存的节点，它并不是一个已经加载好了的DOM结构快照，它是动态的，会随着DOM结构的变化而变化。因此，每次访问nodeList对象，都会运行一次查询。

#### 二、DOM拓展
##### 1.classList属性
操作类名时可以使用(IE10及其它现代浏览器支持)
* `document.classList.add(value)`  将给定字符串添加到列表中
* `document.classList.contains(value)`  判断给定字符串是否处于列表中，有则返回true
* `document.classList.remove(value)`  从列表中删除给定字符串
* `document.classList.toggle(value)`  如果列表中存在值，删除;如果没有，就添加  

##### 2.焦点管理
* `document.activeElement`  返回DOM中当前获取了焦点的元素  
* `document.hasFocus`  检测文档是否获得了焦点

##### 3.插入标记
* `innerHTML`写入`<script>`的话不会执行
* 在插入大量HTML标记是，使用`innerHTML`比手动创建节点效率高得多，因为在设置`innerHTML`时，就会创建一个HTML解析器，这个解析器是在浏览器级别的代码上运行的，比执行JavaScript快得多。

##### 4.scrollIntoView
通过滚动条滚动，让当前元素出现在视图中。

<a id="14" href="javascript:void(0)"></a>
### Day14 事件(一)

#### 一、事件处理程序
##### 1.DOM2级事件处理程序
DOM0级的事件处理方式，就是将一个函数赋值给事件处理程序属性，像这样:
{% highlight javascript %}
    var btn = document.getElementById('btn');
    btn.onclick = function() {
        alert(this.value);  
    }
{% endhighlight %}
在DOM2级里，提供了两个用于指定和删除事件处理程序的方法:
* addEventListener
* removeEventListener

两个方法都接收三个参数:要处理的事件名、处理函数、布尔值。其中布尔值为`true`表示在捕获阶段调用处理函数，`false`表示在冒泡阶段调用。

假设给按钮绑定一个click事件，如果使用DOM0级的方式，给按钮的`onclick`属性赋值为一个函数，将只能绑定一个click事件，多次绑定会覆盖前一个事件。

而用`addEventListener`则可以绑定多个处理函数。如:
{% highlight javascript %}
    var btn = document.getElementById('btn');
    btn.addEventListener('click', function() {
        alert('first');
    }, false);
    btn.addEventListener('click', function() {
        alert('second');
    }, false);
{% endhighlight %}
这样将会先弹出first，然后又弹出second。

值得一提的是，使用`removeEventListener`方法时，必须传入和`addEventListener`一样的参数才能移除处理函数，因此，如果处理函数是一个匿名函数的话，是没有办法被移除的。

##### 2.IE的事件处理程序
IE9以下的浏览器只支持事件冒泡，且不支持DOM2级方法，因此，绑定事件需要使用`attachEvent`和`detachEvent`方法。它们接收要处理的事件名和处理函数两个参数。

使用`attachEvent`和DOM0级方法的主要区别在于事件处理程序的作用域。使用DOM0级方法时，事件处理程序在所属元素的作用域内运行;而在使用`attachEvent`时，事件处理程序会在全局作用域运行。所以`this`等于`window`。
{% highlight javascript %}
    var btn = document.getElementById('btn');
    btn.attachEvent('onclick', function() {
        alert(this === window);  //true
    });
{% endhighlight %}

`attachEvent`也可以给元素绑定多个事件，但执行它们的先后顺序跟`addEventListener`添加的相反，最后添加的，最先执行。

`detachEvent`的使用和`removeEventListener`一样，也是需要传入和`attachEvent`一样的参数，这也意味着添加的匿名函数处理程序不能被移除。
#### 二、事件里的盲区
##### 1.Image对象
对于页面的图像元素来说，并不是图片被加载到文档中才开始下载，而是在设置了它的`src`属性后就开始下载。这点与`script`、`link`标签不同，需要设置引用路径和加载到文档后才会下载，如:
{% highlight javascript %}
    var img = new Image();
    img.src = 'test.png';   //开始下载
{% endhighlight %}
Image对象在DOM0级里就得到了实现，我们可以使用它来预加载资源。

<a id="15" href="javascript:void(0)"></a>
### Day15 事件(二)

##### 2.textInput事件
DOM3级里新增了一个`textInput`事件用于替代`keypress`，但它们的事件行为稍有不同。

* 区别一:任何可以获取焦点的元素都可以触发`keypress`事件，但只有在编辑区才可以触发`textInput`事件
* 区别二:`textInput`事件只有在用户按下能够输入实际字符的键时才会触发，而`keypress`事件则在那些按下可以影响文本显示的键时也会触发(如退格键)。

##### 3.contextmenu事件
用于创建自定义的右键菜单。
##### 4.hashchange事件
监听URL的变化。
#### 三、事件的性能和内存
##### 1.多事件绑定时，使用事件托管
合理的使用建立在事件冒泡基础上的事件托管技术，可以有效地减少事件处理程序的数量。
##### 2.移除已绑定事件的元素
移除已绑定事件的元素时，可能会导致该元素没法被垃圾回收机制处理掉，正确的做法是，在明确知道某一个已绑定事件的元素将被移除时，首先把该事件解绑掉，保证这快内存被回收后还能再次利用。

这也体现出事件托管的优势，如果事件是通过绑定到上层元素的，那么及时该元素被移除掉，也不会产生因绑定了事件而无法移除的情况。

<a id="16" href="javascript:void(0)"></a>
### Day16 表单

#### 一、提交表单
##### 1.submit事件
在单击表单中的提交按钮后，浏览器会先触发表单的`submit`事件，然后才会将数据提交给服务器，因此，如果要做一些数据验证，就可以放到`submit`事件中去，如果得到不符合预期的数据，阻止事件的默认行为就可以取消表单提交。

值得注意的是，如果是手动提交表单的话，将不会触发submit事件。如:
{% highlight javascript %}
    var form = document.getElementById('form');
    form.submit();
{% endhighlight %}
这样将不会触发`submit`事件，所以要把数据验证写在提交之前。
##### 2.reset事件
手动调用`reset()`方法，依然会触发`reset`事件

<a id="17" href="javascript:void(0)"></a>
### Day17 错误处理

##### 1.try-catch语句
{% highlight javascript %}
    try{
        //可能会发生错误的语句
    } catch (error){
        //发生错误时的处理语句
    }
{% endhighlight %}
如果代码中存在`finally`子句，那么无论是否发生错误，都会执行它，且忽略其它语句中的return。如:

{% highlight javascript %}
    function testFanilly(){
        try{
            return 2;
        } catch (error){
            return 1;
        } finally {
            return 0;
        }
    }
{% endhighlight %}
最终返回0;
##### 2.错误类型
* Error 该类型是基类型，其它所有错误类型都继承自该类型
* EvalError 错误使用`eval()`函数时调用，但有时报的是`TypeError`错误
* RangeError 在数值超出相应范围时触发
* ReferenceError 访问不存在的对象时触发
* SyntaxError 存在语法错误时触发
* TypeError 在执行特定类型的操作时，变量的类型并不符合操作所致
* URIError 使用`encodeURI()`和`decodeURI()`是，URI格式不正确所致

##### 3.避免类型错误
{% highlight javascript %}
    function getQUeryString(url) {
        if (typeof url == 'string') {  //恰当的类型检测
            var pos = url.indexOf('?');
            if (pos > -1) {
                return url.subString(pos + 1);
            }
        }
        return "";
    }
{% endhighlight %}

{% highlight javascript %}
    function reverseSort(array) {
        if (values instanceof Array) {  //恰当的类型检测
            array.sort();
            array.reverse();
        }
    }
{% endhighlight %}

<a id="18" href="javascript:void(0)"></a>
### Day18 JSON

##### 1.语法
JSON作为一种数据格式，有以下三种类型的值:
* 简单值: 可以是字符串、数值、布尔值和null，不能是undefined。例如数值`3`、字符串`"simple"`都是有效的JSON数据
* 对象: 键值对中的值可以是简单值，也可以是复杂数据类型的值(对象或数组)，切记键必须加双引号
* 数组: 数组的值也可以是任意类型——简单值、对象或数组。`["hello", 3]`也是有效的JSON数据

##### 2.JSON对象
JSON优于XML的点在于它是JavaScript的子集，能够被`eval()`函数解析、解释并返回JavaScript对象和数组。使用XML格式，我们想取得某个值，需要在DOM结构中通过一大堆方法来找寻;而使用JSON格式，转化为JavaScript对象后就像使用原生对象一样简单。

在ECMAScript5里，定义了全局对象JSON。IE8+才支持这个对象，对于不支持的浏览器，可以用[JSON-js](https://github.com/douglascrockford/JSON-js)来提供支持。
JSON对象有两个方法:
* stringify(): 把JavaScript对象序列化为JSON字符串
* parse(): 把JSON字符串解析为JavaScript对象

{% highlight javascript %}
    var obj = {
        name: "bulger",
        age: 18,
        address: undefined,
        habits: ["sports", "games"]
    };
    var textJSON = JSON.stringify(obj);
    console.log(textJSON);  //{"name":"bulger","age":18,"habits":["sports","games"]}
{% endhighlight %}
默认情况下，`JSON.stringify()`输出的JSON字符串不包含任何空格字符或缩进。并且在序列化JavaScript对象时，会忽略所有函数及原型成员，值为`undefined`的属性也会被跳过。

##### 3.序列化选项
`JSON.stringify()`还可以传入第二、第三个参数，第二个参数是一个过滤器，可以是数组或函数，第三个参数是一个缩进值(字符串或表示多少空格的数值)。
{% highlight javascript %}
    var obj = {
        name: "bulger",
        age: 18,
        address: undefined,
        habits: ["sports", "games"]
    };
    var textJSON = JSON.stringify(obj, ["name", "habits"]);
    console.log(textJSON);  //{"name":"bulger","habits":["sports","games"]}
{% endhighlight %}
过滤器为数组时，返回的字符串中，就会只包含数组中的字符串的属性。
{% highlight javascript %}
    var obj = {
        name: "bulger",
        age: 18,
        address: undefined,
        habits: ["sports", "games"]
    };
    var textJSON = JSON.stringify(obj, function(key, value){
        switch(key){
            case "name":
                return "draven";
            case "habits":
                return ["reading"];
            default:
                return value;
        }
    });
    console.log(textJSON);  //{"name":"draven","age":18,"habits":["reading"]}
{% endhighlight %}
函数过滤器根据传入的键来决定结果。  

第三个参数用于控制结果中的缩进和空白符。如果是个数值，它表示每个级别缩进的空格数。
{% highlight javascript %}
    var obj = {
        name: "bulger",
        age: 18,
        address: undefined,
        habits: ["sports", "games"]
    };
    var textJSON = JSON.stringify(obj, null, 4);
    console.log(textJSON);
    输出:
    {
        "name": "bulger",
        "age": 18,
        "habits": [
            "sports",
            "games"
        ]
    }
{% endhighlight %}

还有一个定义在对象中的`toJSON()`方法，用于更深层次的自定义。

##### 4.解析选项
解析函数`JSON.parse()`也可以传入第二个参数，为了避免和`JSON.stringify()`的过滤函数混淆，它被称为`还原函数`。
{% highlight javascript %}
    var obj = {
        name: "bulger",
        age: 18,
        address: undefined,
        habits: ["sports", "games"]
    };
    var textJSON = JSON.stringify(obj);
    JSON.parse(textJSON, function(key, value){
        if (conditions) {
            return value;
        }
    });
{% endhighlight %}
同过滤器函数一样，传入一个键和一个值，而且都需要返回一个值。如果返回了`undefined`，则表明结果中要删除这个键;返回其它值，就将该值插入到结果中。

<a id="19" href="javascript:void(0)"></a>
### Day19 AJAX(一)
 
#### 一、XMLHttpRequest对象
##### 1.XHR的用法
{% highlight javascript %}
    var xhr = new XHRHttpRequest();     //IE7+才支持这个对象
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 2) {
            //将触发事件的按钮设置为禁用  
        } else if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304) {
                console.log(xhr.responseText);
                //将触发事件的按钮解除禁用
            }
        }  
    };
    xhr.open("get", "text.php", true);
    xhr.send(null);
{% endhighlight %}

`xhr.open()`的第三个参数是个布尔值，表示是否异步发送。  

还可以使用`xhr.abort()`来取消异步请求，调用这个方法后，xhr对象会停止触发事件，也就是说xhr.onreadystatechange事件不会再触发，xhr对象的任何与响应有关的属性也不能再访问。  

##### 2.HTTP头部信息
在发送HTTP请求时，还会发送以下头部信息:
* Accept: 浏览器能够处理的内容类型
* Accept-Charset: 浏览器能够显示的字符集
* Accept-Encoding: 浏览器能够处理的压缩编码
* Accept-language: 浏览器当前设置的语言
* Connection: 浏览器与服务器之间连接的类型
* Cookie: 当前页面设置的任何Cookie
* host: 接收请求的页面所在的域
* referer: 发出请求页面的URI
* User-Agent: 浏览器的用户代理字符串  

我们可以使用XHR对象的`setRequestHeader()`方法自定义请求头，该方法接收两个参数，头部字段的名称和头部字段的值。该方法必须在`open()`方法后和`send()`方法前调用。  

也可以使用`getResponseHeader()`传入头部字段名称，取得相应的响应头部信息;使用`getAllResponseHeaders()`取得所有头部信息。

#### 二、FormData对象
由于服务器对POST请求和提交表单的请求并不会一视同仁，所以服务器必须要有能从发送过来的原始解析出有用的部分，但我们也可以使用XHR对象来模仿表单提交。  

我们需要改变把`Content-type`头信息改为:`appliation/x-www-form-urlencodeed`。  

而现在，我们只需要在新建的`FormData`对象实例上，使用`append()`把键和值作为它的两个参数传进去，就可以把该实例放到`send()`方法中进行传递了，XHR对象在检测到`FormData`对象后，会自动执行头信息处理。

#### 三、进度事件
可以使用xhr对象的`progress`事件来监听浏览器接收新数据的进度，它会周期性的触发。  
`onprogress`事件处理程序会接收一个event对象，对象包含很多属性，我们主要使用其中的三个属性:
* lengthComputable: 进度信息是否可用
* loaded: 已接受的字节数
* total: 根据Content-Length响应头确定预期字节数

<a id="20" href="javascript:void(0)"></a>
### Day20 AJAX(二)

#### 一、跨域技术
##### 1.图片Ping
动态的创建图像Ping，使用它们的`onload`和`onerror`事件处理程序来确定是否接收到了响应。该方法的特点是:
* 简单(通过查询字符串的形式发送数据)
* 单向(只能发GET请求，不能处理服务器响应)
请求从给`Image`对象设置src属性的那一刻开始发送，常用于跟踪用户点击，做数据埋点。

##### 2.JSONP
它同图片Ping技术一样，也是利用`script`标签不受其它域加载资源限制的特点来完成的，但是`script`的特点在于加载到的脚本会被浏览器执行，所以它是双向的，可以事先定义好一个函数，在返回响应里调用该函数，将需要处理的数据使用JSON格式作为函数参数调用，这就是JSONP的原理。  

缺点也很明显，由于是加载其它域的代码来执行，再不能保证所加载代码的安全性时，应用也就处于危险中。

<a id="21" href="javascript:void(0)"></a>
### Day21 高级技巧
 
##### 1.作用域安全的构造函数
{% highlight javascript %}
    function Person(name, age){
        if (this instanceof Person) {
            this.name = name;
            this.age = age;
        }
        return new Person(name, age);
    }
{% endhighlight %}
避免没有使用`new`标识符和定义成其它作用域的变量。  

##### 2.惰性加载函数
有时候为了避免执行不必要的代码，需要使用惰性加载函数，它有以下两种实现方式:  

①在函数内避免多次执行相同的代码，可以在`if`语句内定义一个同名函数覆盖掉包含它的函数并执行，这样下次再执行这个函数，执行的就是`if`语句内新定义的函数了。
{% highlight javascript %}
    function load(){
        if (true) {
            load = function(){
                //doSomething
            };
        } else {
            load = function(){
                //doSomething
            };
        }
    }
{% endhighlight %}
②在声明函数时指定适当的函数，改造上面的函数如下:
{% highlight javascript %}
    var load = (function(){
        if (true) {
            return function(){
                //doSomething
            }
        } else {
            return function(){
                //doSomething
            }
        }
    })();
{% endhighlight %}

##### 3.函数节流(事件防抖)
传入两个参数，需要节流的函数和执行的作用域。
{% highlight javascript %}
    function throttle(method, context){
        clearTimeout(method.tId);
        method.tId = setTimeout(function(){
            method.call(context);
        }, 100);
    }
{% endhighlight %}

<a id="22" href="javascript:void(0)"></a>
### Day22 最佳实践-可维护性
 
#### 一、可维护性
可维护性的代码需要遵循以下几点:
* `直观性`: 让代码简单易懂
* `可拓展性`: 代码架构上容易对核心应用进行拓展
* `可调试性`: 出错时，代码能提供足够的信息方便排查问题

##### 1.可读性
* 命名:变量名使用名词，函数名使用动词开头，如`getName()`。返回布尔类型值的以`isDisable()`开头。
* 变量初始化: 初始该值时就表明这个变量未来将用于存储哪一个类型的值。如下:
{% highlight javascript %}
    var name = ""; //String
    var age = -1;  //Number
    var habits = [];  //Array
    var person = null;  //Object
{% endhighlight %}

##### 2.解耦CSS/JavaScript
避免直接在JavaScript修改元素的样式，而是通过修改对应CSS的类名来达到目的。  

##### 3.解耦应用逻辑/事件处理程序
把事件处理程序中包含的应用逻辑分离出来，便于维护。示例:
{% highlight javascript %}
    function handleKeyPress(event) {
        if (event.keyCode === 13) {
            var target = event.target;
            var value = 5 * parseInt(target.value);
            if (value > 20) {
                document.getElementById('error').style.display = 'block';
            }
        }
    }
{% endhighlight %}

解耦后:
{% highlight javascript %}
    function validateValue(value){
        if (value > 20) {
            document.getElementById('error').style.display = 'block';
        }
    }
    function handleKeyPress(event) {
        if (event.keyCode === 13) {
            var target = event.target;
            var value = 5 * parseInt(target.value);
            validateValue(value);
        }
    }
{% endhighlight %}

##### 4.优化循环
* 减值迭代 
* 简化终止条件: 使用减值迭代后，终止条件的算法复杂度为O(1)
* 简化循环体
* 使用后测试循环: do-while语句

<a id="23" href="javascript:void(0)"></a>
### Day23 HTML5——File API

HTML5中提供了一些API，让浏览器也可以访问本地文件。各浏览器的支持情况如下：
![File API的浏览器支持](http://navcd-1252873427.file.myqcloud.com/head_img/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-28%20%E4%B8%8B%E5%8D%885.25.57.png)
在表单文件控件选择了一个或多个文件时，可以通过files集合来访问，files包含一个file对象，该对象有以下属性：
* name：文件名
* size：文件的字节大小
* type：字符串，文件的MIME类型
* lastModified：文件在本地的最后修改时间
{% highlight JavaScript %}
    var file = document.querySelector("input[type='file']");
    file.addEventListener('change', function (e) {
        var target = e.target;
        console.log(target.files[0]);
    }, false)
{% endhighlight %}

##### FileReader 类型
该对象提供了以下4个方法来异步读取数据：
* readAsText(file,encoding)：以纯文本的形式读取文件，结果存在result中。第二个参数指定编码格式。
* readAsDataURL(file)：读取文件并将文件以数据URL的形式保存在result中。
* readAsBinaryString(file)：读取文件并将一个字符串保存在result属性中，字符串中每个字符表示一字节。
* readAsArrayBuffer：读取文件并将一个包含文件内容的ArrayBuffer保存在result中。

由于读取过程是异步的，因此FileReader对象提供了几个事件。
- progress：在上传过程中，每过50ms就会触发一次该事件，通过对象可以获得和XHR的progress事件相同的信息：lengthComputable、loaded和total。虽然数据没有读取完毕，但是也可以使用result属性读取到文件内容。
- error：无法读取文件时，触发该事件，相关信息保存在FileReader对象的error属性中，error属性是个对象，只保存一个名为code的值，表示错误的状态码。1(未找到文件)，2(安全性错误)，3(读取中断)，4(文件不可读)，5(编码错误)
- load：文件加载成功后触发。

一个应用场景是在上传图片时，把选中而未开始上传的图片回显出来。
{% highlight JavaScript %}
    var file = document.getElementById('file'),
        div = document.getElementById('div');
    file.addEventListener('change', function (e) {
        var reader = new FileReader();
        var uploadFile = e.target.files[0];
        if (/image/.test(uploadFile.type)) {
            reader.readAsDataURL(uploadFile);
            reader.error = function () {
                console.log(reader.error);
            };
            reader.onload = function () {
                imgWrap.innerHTML = '<img src="'+reader.result+'">';
            };
        }
    }, false)
{% endhighlight %} 

End!