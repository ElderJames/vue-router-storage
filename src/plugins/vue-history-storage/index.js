/* @flow */
import Path from './history-path'

var beforeState = 0;
var enterPath = '';
const routerhistory = [];

const _history = {
    routerhistory: [],
    enterPath: '',
    beforeState: 0
}

if (localStorage.getItem("history"))
    _history.routerhistory = JSON.parse(localStorage.getItem("history"))


export default {
    install: function (Vue, option) {

        if (this.isInstall) {
            console.log('installed')
            return;
        }
        else
            this.isInstall = true;

        Vue.prototype.$history = _history;
        // Vue.prototype.$routerhistory = routerhistory;
        // Vue.prototype.beforeState = 0;

        Vue.mixin({
            created() {
                var vm = this.$root;

                if (_history.enterPath != '') return;

                if (!vm.$router || !vm.$route) {
                    console.warn('[HistoryStorage]:Please used VueRouter first.')
                    return;
                }

                this.$watch('$history.routerhistory', function (val) {
                    console.log('save history:' + JSON.stringify(val.routerhistory));
                    localStorage.setItem('history', JSON.stringify(val.routerhistory));
                }, { deep: true })


                //先获得访问vue页面时的路径
                _history.enterPath = location.pathname;
                history.replaceState(0, null, '/');
                //有历史记录
                if (_history.routerhistory.length > 0) {
                    console.log('resolve routers from localStorage')
                    for (var idx = 0; idx < _history.routerhistory.length; idx++) {
                        history.pushState(idx + 1, null, _history.routerhistory[idx]);
                    }
                    //进来时的路径与保存的历史记录中的最后一个不相同,追加
                    if (_history.routerhistory[_history.routerhistory.length - 1] !== _history.enterPath) {
                        console.log('add enterPath: ' + _history.enterPath);
                        _history.routerhistory.push(_history.enterPath);
                        history.pushState(_history.routerhistory.length, null, _history.enterPath);
                        localStorage.setItem('history', JSON.stringify(_history.routerhistory));
                    }
                }
                else if (vm.$route.fullPath !== '' && vm.$route.fullPath !== '/') {
                    console.log('resolve routers from routeMatched')
                    for (var idx = 0; idx < vm.$route.matched.length; idx++) {
                        history.pushState(idx + 1, null, vm.$route.matched[idx].path);
                        _history.routerhistory.push(vm.$route.matched[idx].path)
                        localStorage.setItem('history', JSON.stringify(_history.routerhistory));
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
                        _history.routerhistory.pop();
                        next();
                    }
                    else {
                        console.log('go forward')
                        vm.$emit('goforward')
                        next();
                        //前进
                        _history.routerhistory.push(to.fullPath);
                        if (typeof history.state != 'number')
                            history.replaceState(history.length, null, to.fullPath)
                    }
                    _history.beforeState = history.state;
                    // console.log('save history:' + JSON.stringify(routerhistory));
                    localStorage.setItem('history', JSON.stringify(_history.routerhistory));

                })
            },
        })

        Vue.component('history-path', Path)

    }
}

