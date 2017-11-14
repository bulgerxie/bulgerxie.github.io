function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

// 需要监听的数组方法
const operations = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
const arrayPrototype = Array.prototype;

class Observe {
  constructor(obj, callback) {
    if (isObject(obj)) {
      this.watch(obj);
    } else if (isArray(obj)) {
      this.observeArray(obj);
    } else {
      return
    }
    this.callback = callback;
  }

  watch(obj, fatherPath = '') {
    Object.keys(obj).forEach(key => {
      let oldVal = obj[key];
    let path = fatherPath ? `${fatherPath}.${key}` : key;
    if (isObject(oldVal)) {
      this.watch(oldVal, path);
    }
    if (isArray(oldVal)) {
      this.observeArray(oldVal, path);
    }
    Object.defineProperty(obj, key, {
      get: function () {
        return oldVal;
      },
      set: (function (newVal) {
        if (oldVal !== newVal) {
          if (isObject(newVal)) {
            this.watch(newVal, path);
          }
          if (isArray(newVal)) {
            this.observeArray(newVal, path);
          }
          this.callback(oldVal, newVal, path);
          oldVal = newVal;
        }
      }).bind(this)
    })
  })
  }

  observeArray(array, path) {
    let self = this;
    let arrPro = Object.create(arrayPrototype);
    operations.forEach(method => {
      arrPro[method] = function () {
        arrayPrototype[method].apply(this, arguments);
        console.log(`数组执行了 ${method} 操作`);
        self.watch(array, path);
      }
    });
    array.__proto__ = arrPro;
    self.watch(array, path);
  }
}

// 测试用例

let obj = {
  a: 1,
  b: {
    c: 2
  },
  d: 'hello'
};

let arr = [1, 2, 3];

let test = new Observe(obj, function (oldVal, newVal, path) {
  console.log(`通知: 数据索引为 ${path} 的值发生变化(${oldVal} => ${newVal})`);
});

// arr.push(1);
//
// arr[3] = [0, 123];
//
// arr[3][0] = 1;
//
// arr[3].push(4);

obj.b.c = {
  e: 0
}