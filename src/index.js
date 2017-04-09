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

export default {
    install: function (Vue, option) {
        if (this.isInstall) {
            console.log('installed')
            return;
        }
        this.isInstall = true;

        if (Store.Resolve())
            console.log('resolve routers from localStorage');

        Object.defineProperty(Vue.prototype, '$history', {
            get() { return _history }
        })

        Vue.mixin({
            created() {
                var vm = this.$root;

                if (_history.enterPath != '') return;

                if (!vm.$router || !vm.$route) {
                    console.warn('[HistoryStorage]:Please used VueRouter first.')
                    return;
                }

                //先获得访问vue页面时的路径
                _history.enterPath = vm.$route.fullPath;
                _history.base = '/' + vm.$router.options.base;
                console.log('EnterPath:' + _history.enterPath)
                if (_history.enterPath == '/') {
                    Store.Clear();
                }
                //有历史记录
                else {
                    history.replaceState({ key: genKey() }, '', _history.base);

                    if (_history.routes.length > 0) {
                        for (var idx = 0; idx < _history.routes.length; idx++) {
                            history.pushState({ key: genKey() }, '', _history.base + _history.routes[idx]);
                        }
                        //进来时的路径与保存的历史记录中的最后一个不相同,追加
                        if (_history.routes[_history.routes.length - 1] !== _history.enterPath) {

                            _history.routes.push(_history.enterPath);
                            history.pushState({ key: genKey() }, '', _history.base + _history.enterPath);
                            if (Store.Save())
                                console.log('routers saved with localStorage');
                        }
                    }
                    else if (vm.$route.fullPath !== '' && vm.$route.fullPath !== '/') {
                        console.log('resolve routers from routeMatched')
                        for (var idx = 0; idx < vm.$route.matched.length; idx++) {
                            history.pushState({ key: genKey() }, '', _history.base + vm.$route.matched[idx].path);
                            _history.routes.push(vm.$route.matched[idx].path);
                            if (Store.Save())
                                console.log('routers saved with localStorage');
                        }
                    }
                    _history.beforeState = history.state;
                }

                vm.$router.beforeEach((to, from, next) => {
                    if (to.path == '/' || history.state && _history.beforeState && history.state.key && Number(_history.beforeState.key) > Number(history.state.key)) {
                        console.log('go back')
                        vm.$emit('goback')
                        //后退
                        _history.routes.pop();
                        next();
                    }
                    else {
                        console.log('go forward')
                        vm.$emit('goforward')
                        next();
                        //前进
                        _history.routes.push(to.fullPath);
                        // if (typeof history.state != 'number')
                        //     history.replaceState({ key: genKey() }, '', to.fullPath)
                    }
                    _history.beforeState = history.state;
                    if (Store.Save())
                        console.log('routers saved with localStorage');
                })
            }
        })

        Vue.component('history-path', Path)

    }
}

