---
layout: post
title:  "面试"
date:   2017-03-09
categories: 面试
excerpt: 答题
---

##### 一:

```javascript
function set(n) {
            let set = new Set();
            while(set.size < n)
            {
                set.add(Math.floor(Math.random()*30+2))
            }
             console.log([...set]);
        }
        set(10);
        function closeFar(x, y, z) {
            var max = Math.max.apply(null, arguments);
            var min = Math.min.apply(null, arguments);
            for (var i in arguments) {
                if (arguments[i] != max && arguments[i] != min) {
                    var middle = arguments[i];
                }
            }
            if (max - min >= 2) {
                if (max - middle >= 2 && middle - min <= 1) {
                    return true;
                } else if (max - middle <= 1 && middle - min >= 2) {
                    return true;
                }
                else {
                    return false;
                }
            } else {
                return false;
            }
        }
        console.log(closeFar(1, 2, 4));
```

##### 二:

```javascript
function xyzThere(str) {
        var index = str.search(/xyz/);
        if(index>-1){
            if(str.slice(index-1,index)!='.'){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    console.log(xyzThere('xyz.abc'));
```

##### 三:对单页面程序的理解
优点:

1、分离前后端,各司其职

2、减轻服务器压力

缺点:

1、前进、后退、地址栏等，需要程序进行管理

2、初次加载耗时相对增多


可实现的类库:backbone,angular,vue,react