# vue-router-storage

> A solution to the Vue history routing Persistence. 

[中文文档](https://github.com/zack24q/vue-router-storage/blob/master/README_CN.md)

##### Current function

1. Persistent user browsing records, and automatically restores the original path when you re-enter the Vue application.
2. When you enter the Vue application without history, the predecessor history is automatically created so that the application can 'return' to the previous page.
3. When the route arrives at the root directory, prevent it from continuing to retreat (because it originally jumped from another site to this Vue application) and quit the Vue scope.
4. The routing change triggers the advance (router. GoForward), back (router. GoBack), overwrite (router. Replace), and reach the root directory (router. inroot) events.

*If your vue application needs to jump to a third party page, and then jump back, want to restore to the original history and continue to operate, the use of this plug-in is the best solution.*

### Why

Vue in the use of HTML5 history mode, through the browser for forward and backward operations. However, when the multi-level routing address directly in the address bar or jump from the external link to the Vue application multi-level routing, it will cause the history is lost, can not return to the embarrassing situation of the parent page. This program provides vue with historical refactoring and persistence capabilities to address the loss of historical records and the inability to roll back.



### How

Based on the localStorage / cookie store, when the Vue instance is created, check whether the local history is saved or not. If not, save the route path and inject the route matching path into the browser history through the history.pushState method Record, the browser to get back to the higher-level routing; if you have saved history, the history will be injected into the browser, so that users can reopen the page to continue the last operation.

### Screenshot

![](https://github.com/ElderJames/vue-router-storage/blob/master/screenshot/vue-router-storage-example.gif?raw=true)

## Use Setup

1. The command line executes the npm installation package
``` bash
# install vue-router-storage package
npm install --save vue-router-storage

```
2. Add the following code to the entry file
```javascript
import Vue from 'vue'
import RouterStorage from 'vue-router-storage'

Vue.use(RouterStorage);
```

3. Add the following configuration to webpack
```javascript
    resolve: {
        ...
        alias: {
            'vue-router-storage': 'vue-router-storage/dist/vue-router-storage.esm.js',
        }
    },
```

Enjoy it!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
