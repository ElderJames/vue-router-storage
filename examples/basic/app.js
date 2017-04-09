import Vue from 'vue'
import Router from 'vue-router'
import RouterStorage from 'vue-router-storage'

Vue.use(Router)
Vue.use(RouterStorage)

Vue.config.productionTip = false

const App = {
  name: 'App',
  template: `
    <div id="app">
      <h1>Vue Router Storage example</h1>
      <button @click="clearStore">Clear Store</button>
      <history-path></history-path>
      <p>level 1</p>
      <router-view></router-view>
    </div>
  `,
  methods: {
    clearStore() {
      localStorage.removeItem('history');
      this.$history.routes.splice(0, this.$history.routes.length);

    }
  }
}

const Hello = {
  template: `
    <router-link to="/level2">
      Hello Word!
    </router-link>`
}

const Level2 = {
  template: '<div>Level2 <router-view></router-view></div>'
}

const Level3 = {
  template: '<div>Level3 <router-view></router-view></div>'
}

const comp1 = {
  template: '<div><h1>comp1</h1><router-link to="/level2/level3/comp2">To Comp2</router-link></div>'
}

const comp2 = {
  template: '<div><h1>comp2</h1><router-link to="/level2/level3/comp3">To Comp3</router-link></div>'
}

const comp3 = {
  template: '<div><h1>comp3</h1><router-link to="/level2/level3/comp2">To Comp2</router-link></div>'
}

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Hello,
    },
    {
      path: '/level2',
      component: Level2,
      children: [
        {
          path: '',
          component: comp1,
        },
        {
          path: 'level3',
          component: Level3,
          children: [
            {
              path: '',
              component: comp2,
            },
            {
              path: 'comp2',
              component: comp2,
            },
            {
              path: 'comp3',
              component: comp3,
            }
          ]
        }
      ]
    }
  ]
})

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
