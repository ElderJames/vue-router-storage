import localStorage from './storage'

export let _history = {
    routes: [],
    forwardRoutes: [],
    enterPath: '',
    base: '',
    beforeState: 0,
    length: 0,
    $root: null,
    clear() {
        this.routes.splice(0, this.routes.length);
        localStorage.Save();
    }
}

export default {

}