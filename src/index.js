/* @flow */
import Path from './history-path'
import Store from './storage'
import { _history } from './history'

const Time = window.performance && window.performance.now
    ? window.performance
    : Date

function genKey() {
    return Time.now().toFixed(3)
}

export default class RouterStorage {

}

RouterStorage.install = function (Vue, option) {
    if (this.isInstall) {
        if (process.env.NODE_ENV == 'development')
            console.log('installed')
        return;
    }
    this.isInstall = true;

    Store.Resolve()

    Object.defineProperty(Vue.prototype, '$history', {
        get() { return _history }
    })

    Vue.mixin({
        created() {
            var vm = this.$root;

            if (_history.enterPath != '') return;

            if (!vm.$router || !vm.$route) {
                if (process.env.NODE_ENV == 'development')
                    console.warn('[HistoryStorage]:Please used VueRouter first.')
                return;
            }

            //先获得访问vue页面时的路径
            _history.enterPath = vm.$route.fullPath;
            _history.base = vm.$router.options.base ? '/' + vm.$router.options.base : '';
            if (process.env.NODE_ENV == 'development')
                console.log('EnterPath:' + _history.enterPath)
            if (_history.enterPath == '/') {
                Store.Clear();
            }
            if (_history.base != '') {
                //在根路径前多加一个记录，防止退后时跳出Vue，无法再执行判断和禁止后退操作
                history.replaceState({ key: -1 }, '', _history.base + '/__root');
                history.pushState({ key: genKey() }, '', _history.base + '/');
            }
            //有历史记录
            if (_history.routes.length > 0) {
                for (var idx = 0; idx < _history.routes.length; idx++) {
                    history.pushState({ key: genKey() }, '', _history.base + _history.routes[idx]);
                }
                //进来时的路径与保存的历史记录中的最后一个不相同,追加
                if (_history.routes[_history.routes.length - 1] !== _history.enterPath) {
                    _history.routes.push(_history.enterPath);
                    history.pushState({ key: genKey() }, '', _history.base + _history.enterPath);
                }
                Store.Save();
            }
            else if (vm.$route.fullPath !== '' && vm.$route.fullPath !== '/') {
                if (process.env.NODE_ENV == 'development')
                    console.log('resolve routers from routeMatched')
                for (var idx = 0; idx < vm.$route.matched.length - 1; idx++) {
                    var path = vm.$route.matched[idx].path;
                    history.pushState({ key: genKey() }, '', _history.base + path);
                    _history.routes.push(path);
                }
                history.pushState({ key: genKey() }, '', _history.base + vm.$route.fullPath);
                _history.routes.push(vm.$route.fullPath);
                Store.Save();
            }
            _history.beforeState = history.state;

            vm.$router.beforeEach((to, from, next) => {
                if (process.env.NODE_ENV == 'development') {
                    console.log('befaultState:' + JSON.stringify(_history.beforeState));
                    console.log('currentState:' + JSON.stringify(history.state));
                    console.log('to:' + to.path);
                }
                if (to.path == '/' || history.state && _history.beforeState && history.state.key && Number(_history.beforeState.key) > Number(history.state.key)) {
                    if (to.path == '/__root' && history.state.key === -1) {
                        if (process.env.NODE_ENV == 'development')
                            console.log('Is root,can\'t back!')
                        next(false);
                        _history.beforeState = { key: genKey() }
                        for (var idx = _history.forwardRoutes.length - 1; idx >= 0; idx--) {
                            // console.log('add url:' + _history.base + _history.forwardRoutes[idx])
                            history.pushState({ key: genKey() }, '', _history.base + _history.forwardRoutes[idx])
                        }
                        history.go(-1 * _history.forwardRoutes.length)
                    } else {
                        if (process.env.NODE_ENV == 'development')
                            console.log('go back')
                        vm.$emit('goback')
                        //后退
                        if (_history.routes.length > 0)
                            _history.forwardRoutes.push(_history.routes.pop());
                        next();
                        _history.beforeState = history.state;
                    }
                }
                else {
                    if (process.env.NODE_ENV == 'development')
                        console.log('go forward')
                    vm.$emit('goforward')
                    //前进
                    _history.routes.push(to.fullPath);
                    _history.forwardRoutes = [];
                    next();
                    _history.beforeState = history.state;
                }
                console.log(_history.forwardRoutes)

                Store.Save()
            })
        }
    })

    Vue.component('history-path', Path)
}

if (window.Vue) {
    window.Vue.use(RouterStorage)
}
