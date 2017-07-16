
let _localStorage = localStorage;
//检测浏览器是否支持localStorage
if (typeof _localStorage == 'undefined') {
    if (process.env.NODE_ENV == 'development')
        console.info('[router-storage]:because your browser dosen\'t surpport localstorage,router-storage will use cookie right here.')
    //用cookie实现localStorage
    var localStorageClass = function () {
        this.options = {
            expires: 60 * 24 * 3600,
            domain: "/"
        }
    }
    localStorageClass.prototype = {
        //初实化。添加过期时间
        init: function () {
            var date = new Date();
            date.setTime(date.getTime() + 60 * 24 * 3600);
            this.setItem('expires', date.toGMTString());
        },
        //内部函数 参数说明(key) 检查key是否存在
        findItem: function (key) {
            var bool = document.cookie.indexOf(key);
            if (bool < 0) {
                return true;
            } else {
                return false;
            }
        },
        //得到元素值 获取元素值 若不存在则返回 null
        getItem: function (key) {
            var i = this.findItem(key);
            if (!i) {
                var array = document.cookie.split(';')
                for (var j = 0; j < array.length; j++) {
                    var arraySplit = array[j];
                    if (arraySplit.indexOf(key) > -1) {
                        var getValue = array[j].split('=');
                        //将 getValue[0] trim删除两端空格
                        getValue[0] = getValue[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '')
                        if (getValue[0] == key) {
                            return getValue[1];
                        } else {
                            return 'null';
                        }
                    }
                }
            }
        },
        //重新设置元素
        setItem: function (key, value) {
            var i = this.findItem(key)
            document.cookie = key + '=' + value;
        },
        //清除cookie 参数一个或多一
        clear: function () {
            for (var cl = 0; cl < arguments.length; cl++) {
                var date = new Date();
                date.setTime(date.getTime() - 100);
                document.cookie = arguments[cl] + "=a; expires=" + date.toGMTString();
            }
        },
        removeItem: function (key) {
            this.clear(key)
        }
    }
    _localStorage = new localStorageClass();
    _localStorage.init();
}

import { _history } from './history'

export default {
    Save() {
        _localStorage.setItem('history', JSON.stringify(_history.routes))
        var result = _localStorage.getItem('history') != null;
        if (result && process.env.NODE_ENV == 'development')
            console.log('[router-storage]:save routes by localStorage');
        return result;
    },
    Resolve() {
        if (_localStorage.getItem('history'))
            _history.routes = JSON.parse(_localStorage.getItem('history'));
        var result = _history.routes.length > 0;
        if (result && process.env.NODE_ENV == 'development')
            console.log('[router-storage]:resolve routes from localStorage');
        return result;
    },
    Clear() {
        _localStorage.removeItem('history')
        _history.routes = []
        var result = _localStorage.getItem('history') && _history.routes.length == 0;
        if (result && process.env.NODE_ENV == 'development')
            console.log('[router-storage]:clear routes from localStorage');
        return result;
    }
}
