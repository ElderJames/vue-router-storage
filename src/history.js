import localStorage from './storage'

export let _history = {
    routes: [],
    forwardRoutes: [],
    enterPath: '',
    base: '',
    beforeState: 0,
    length: 0,
    lastKey: '',
    $root: null,
    clear() {
        this.routes.splice(0, this.routes.length);
        this.forwardRoutes.splice(0, this.forwardRoutes.length);
        this.lastKey = '';
        this.length = 0;
        this.beforeState = 0;
        localStorage.Save();
    }
}

export default {

}