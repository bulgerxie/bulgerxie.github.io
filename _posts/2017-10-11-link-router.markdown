---
layout: post
title:  "写一个前端路由"
date:   2017-10-11
categories: 《router》
spend: 
excerpt: ""
---

#### 1.什么是前端路由

传统的页面路由是放在后端来做的，访问不同的URL，跳转到不同的页面。但在单页应用中，数据的替换都是使用ajax来进行的。通过切换页面来使用不同的功能更为符合用户习惯，为了模拟这种行为，我们需要让url的变换和数据替换同时触发。

现在让前端来维护这个路由路径和决定url与之相对应数据，这便是前端路由。

#### 2.history
得益于HTML5的发展，DOM提供了一个[history](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)对象，可以让我们访问、添加和修改浏览器的历史记录。

* 访问:

{% highlight javascript %}
//向后移动历史记录
window.history.back();
//向前移动历史记录
window.history.forward();
//跳转到history中指定的点，x=0:代表当前位置；x=-1:向后移动一个页面；x=1:向前移动一个页面
window.history.go(x);
//获取历史堆栈中页面的数量
window.history.length
{% endhighlight %}

* 添加:
{% highlight javascript %}
var state1 = { title: "hello title" };
history.pushState(state1, "new page1", "new1.html");
{% endhighlight %}

向当前页添加一个名为`new1.html`的历史记录，它的状态值为`state1`对象，标题为`new page1`。

* 修改:
{% highlight javascript %}
var state2 = { title: "hello title" };
history.replaceState(state2, "new page2", "new2.html");
{% endhighlight %}

将当前位置的历史记录替换为`new2.html`，它的状态值为`state2`对象，标题为`new page2`。用法和`pushstate`一样，区别在于该操作不会将当前页面存储在历史记录里。

#### 3.实现

接下来实现一个菜单页，点击菜单选项，用`pushState`模拟跳转页面，点击前进或后退会触发`popstate`事件，所以我们可以监听它来进行数据的替换。首页使用`replaceState`来替换当前url，所以可以看到，例子里虽然访问的是: 

[https://link-router.herokuapp.com](https://link-router.herokuapp.com) 

但是它跳转到的是
 
[https://link-router.herokuapp.com/?area=asia](https://link-router.herokuapp.com/?area=asia)

却没有添加历史记录，所以浏览器返回按钮不可用。


#### 4.history对比hash实现

优点:  
1.得到的url更符合后端路由的形式，`hash`形式会多一个`#`  
2.可以模拟跨浏览器同源策略的url形式

缺点:  
1.回退或前进后不能回到刚才的位置，`hash`可以  
2.需要服务端的配合才能有更好的体验，否则直接访问没有的文件路径，会直接返回404，而`hash`使用的是锚点，即使不存在也不会出现显性的错误提示。  
3.对IE8以下的浏览器没有支持