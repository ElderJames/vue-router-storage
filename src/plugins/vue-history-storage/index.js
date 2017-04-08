/* @flow */
import Path from './history-path'
import Store from './storage'
import { _history } from './history'

export default {
    install: function (Vue, option) {
        if (this.isInstall) {
            console.log('installed')
            return;
        }
        else
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
                _history.enterPath = location.pathname;
                history.replaceState(0, null, '/');
                //有历史记录
                if (_history.routes.length > 0) {
                    for (var idx = 0; idx < _history.routes.length; idx++) {
                        history.pushState(idx + 1, null, _history.routes[idx]);
                    }
                    //进来时的路径与保存的历史记录中的最后一个不相同,追加
                    if (_history.routes[_history.routes.length - 1] !== _history.enterPath) {
                        console.log('add enterPath: ' + _history.enterPath);
                        _history.routes.push(_history.enterPath);
                        history.pushState(_history.routes.length, null, _history.enterPath);
                        if (Store.Save())
                            console.log('routers saved with localStorage');
                    }
                }
                else if (vm.$route.fullPath !== '' && vm.$route.fullPath !== '/') {
                    console.log('resolve routers from routeMatched')
                    for (var idx = 0; idx < vm.$route.matched.length; idx++) {
                        history.pushState(idx + 1, null, vm.$route.matched[idx].path);
                        _history.routes.push(vm.$route.matched[idx].path);
                        if (Store.Save())
                            console.log('routers saved with localStorage');
                    }
                }
                _history.beforeState = history.state;

                vm.$router.beforeEach((to, from, next) => {
                    console.log('beforeState:' + _history.beforeState)
                    console.log('currentState:' + history.state)
                    if (to.path == '/' || typeof history.state == 'number' && _history.beforeState > history.state) {
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
                        if (typeof history.state != 'number')
                            history.replaceState(_history.routes.length, null, to.fullPath)
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

