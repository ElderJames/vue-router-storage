/* @flow */
import Path from './history-path'

var beforeState = 0;
var enterPath = '';
const routerhistory = [];

if (localStorage.getItem("history"))
    routerhistory = JSON.parse(localStorage.getItem("history"))


export default {
    install: function (Vue, option) {

        if (this.isInstall) {
            console.log('installed')
            return;
        }
        else
            this.isInstall = true;

        Vue.prototype.$routerhistory = routerhistory;
        Vue.prototype.beforeState = 0;

        Vue.mixin({
            created() {
                var vm = this.$root;

                if (vm.enterPath) return;

                if (!vm.$router || !vm.$route) {
                    console.warn('[HistoryStorage]:Please used VueRouter first.')
                    return;
                }

                vm.$watch('$routerhistory', function (val) {
                    console.log('save history:' + JSON.stringify(val));
                    localStorage.setItem('history', JSON.stringify(val));
                }, { deep: true })


                //先获得访问vue页面时的路径
                vm.enterPath = location.pathname;
                history.replaceState(0, null, '/');
                //有历史记录
                if (vm.$routerhistory.length > 0) {
                    console.log('resolve routers from localStorage')
                    for (var idx = 0; idx < vm.$routerhistory.length; idx++) {
                        history.pushState(idx + 1, null, vm.$routerhistory[idx]);
                    }
                    //进来时的路径与保存的历史记录中的最后一个不相同,追加
                    if (vm.$routerhistory[vm.$routerhistory.length - 1] !== vm.enterPath) {
                        console.log('add enterPath: ' + vm.enterPath);
                        vm.$routerhistory.push(vm.enterPath);
                        history.pushState(vm.$routerhistory.length, null, vm.enterPath);
                        localStorage.setItem('history', JSON.stringify(vm.$routerhistory));
                    }
                }
                else if (vm.$route.fullPath !== '' && vm.$route.fullPath !== '/') {
                    console.log('resolve routers from routeMatched')
                    for (var idx = 0; idx < vm.$route.matched.length; idx++) {
                        history.pushState(idx + 1, null, vm.$route.matched[idx].path);
                        vm.$routerhistory.push(vm.$route.matched[idx].path)
                        localStorage.setItem('history', JSON.stringify(vm.$routerhistory));
                    }
                }
                vm.beforeState = history.state;

                vm.$router.beforeEach((to, from, next) => {
                    console.log('beforeState:' + vm.beforeState)
                    console.log('currentState:' + history.state)
                    if (to.path == '/' || typeof history.state == 'number' && vm.beforeState > history.state) {
                        console.log('go back')
                        vm.$emit('goback')
                        //后退
                        vm.$routerhistory.pop();
                        next();
                    }
                    else {
                        console.log('go forward')
                        vm.$emit('goforward')
                        next();
                        //前进
                        vm.$routerhistory.push(to.fullPath);
                        if (typeof history.state != 'number')
                            history.replaceState(history.length, null, to.fullPath)
                    }
                    vm.beforeState = history.state;
                    // console.log('save history:' + JSON.stringify(routerhistory));
                    localStorage.setItem('history', JSON.stringify(vm.$routerhistory));

                })


                console.log(vm.$routerhistory);
            },
        })

        Vue.component('history-path', Path)

    }
}

