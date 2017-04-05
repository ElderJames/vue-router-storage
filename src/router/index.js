import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

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

export default new Router({
  mode: 'history',
  history: true,
  routes: [
    {
      path: '/',
      component: Hello
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
