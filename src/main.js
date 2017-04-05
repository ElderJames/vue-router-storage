// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

const routerhistory = [];
var historylength = 0;
var beforeState = 0;
var isRoot = false;

if (localStorage.getItem("history"))
  routerhistory = JSON.parse(localStorage.getItem("history"))

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  data: {
    routerhistory,
  },
  template: '<div>{{routerhistory.join(" -> ")}}<App/></div>',
  components: { App },
  created() {
    //先获得访问vue页面时的路径
    var enterPath = location.pathname;
    history.replaceState(0, null, '/');
    //有历史记录
    if (routerhistory.length > 0) {
      console.log('resolve routers from localStorage')
      for (var idx = 0; idx < routerhistory.length; idx++) {
        history.pushState(idx + 1, null, routerhistory[idx]);
      }
      //进来时的路径与保存的历史记录中的最后一个不相同,追加
      if (routerhistory[routerhistory.length - 1] !== enterPath) {
        console.log('add enterPath: ' + enterPath);
        routerhistory.push(enterPath);
        history.pushState(routerhistory.length, null, enterPath);
        localStorage.setItem('history', JSON.stringify(routerhistory));
      }
    }
    else if (this.$route.fullPath !== '' && this.$route.fullPath !== '/') {
      console.log('resolve routers from routeMatched')
      for (var idx = 0; idx < this.$route.matched.length; idx++) {
        history.pushState(idx + 1, null, this.$route.matched[idx].path);
        routerhistory.push(this.$route.matched[idx].path)
        localStorage.setItem('history', JSON.stringify(routerhistory));
      }
    }

    //在原选项卡修改url导致刷新时，先判断history.length==routerhistory.length+1，则push
    // if (history.length == routerhistory.length + 1)
    //   routerhistory.push(location.href);
    //后退到中间刷新url，减少routerhistory

    historylength = history.length;
    beforeState = history.state;

  }
})

window.onpopstate = function (e) {
  if (isRoot) history.forward();
  else
    if (beforeState == 0)
      isRoot = true;
}

vm.$router.beforeEach((to, from, next) => {
  console.log('beforeState:' + beforeState)
  console.log('currentState:' + history.state)
  if (to.path == '/' || typeof history.state == 'number' && beforeState > history.state) {
    console.log('go back')

    //后退
    routerhistory.pop();
    next();

  }
  else {
    console.log('go forward')
    next();
    //前进
    routerhistory.push(to.fullPath);
    if (typeof history.state != 'number')
      history.replaceState(history.length, null, to.fullPath)
  }
  historylength = history.length;
  beforeState = history.state;
})

vm.$watch("routerhistory", function (val) {
  localStorage.setItem('history', JSON.stringify(val));
}, { deep: true })

window.vm = vm;
window.routerhistory = routerhistory;