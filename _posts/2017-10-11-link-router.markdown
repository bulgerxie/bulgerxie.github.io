---
layout: post
title:  "写一个前端路由"
date:   2017-10-11
categories: 《router》
spend: 
excerpt: ""
---

#### 1.什么是前端路由

传统的页面路由是放在后端来做的,访问不同的URL,跳转到不同的页面。但在单页应用中,数据的替换都是使用ajax来进行的。通过切换页面来使用不同的功能更为符合用户习惯,为了模拟这种行为,我们需要让url的变换和数据替换同时触发。

现在让前端来维护这个路由路径和决定url与之相对应数据,这便是前端路由。

#### 2.history
得益于HTML5的发展,DOM提供了一个[history](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)对象,可以让我们访问、添加和修改浏览器的历史记录。

* 访问:

{% highlight javascript %}
//向后移动历史记录
window.history.back();
//向前移动历史记录
window.history.forward();
//跳转到history中指定的点,x=0:代表当前位置;x=-1:向后移动一个页面;x=1:向前移动一个页面
window.history.go(x);
//获取历史堆栈中页面的数量
window.history.length
{% endhighlight %}

* 添加:
{% highlight javascript %}
var state1 = { title: "hello title" };
history.pushState(state1, "new page1", "new1.html");
{% endhighlight %}

向当前页添加一个名为`new1.html`的历史记录,它的状态值为`state1`对象,标题为`new page1`。

* 修改:
{% highlight javascript %}
var state2 = { title: "hello title" };
history.replaceState(state2, "new page2", "new2.html");
{% endhighlight %}

将当前位置的历史记录替换为`new2.html`,它的状态值为`state2`对象,标题为`new page2`。用法和`pushstate`一样,区别在于该操作不会将当前页面存储在历史记录里。

#### 3.实现

接下来实现一个菜单页,点击菜单选项,用`pushState`模拟跳转页面,点击前进或后退会触发`popstate`事件,所以我们可以监听它来进行数据的替换。首页使用`replaceState`来替换当前url,所以可以看到,例子里虽然访问的是: 

[https://link-router.herokuapp.com](https://link-router.herokuapp.com) 

但是它跳转到的是
 
[https://link-router.herokuapp.com/?area=asia](https://link-router.herokuapp.com/?area=asia)

却没有添加历史记录,所以浏览器返回按钮不可用。

和`hash`实现的方式比起来,`history`还需要服务端的配合才能有更好的用户体验,否则直接访问一个带文件路径的页面就会返回404了,而`hash`使用的是锚点的方式,不存在也不会出现显性的错误提示。