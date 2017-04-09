export default {
    name: 'history-path',
    template: '<div>{{path.join(" -> ")}}</div>',
    data() {
        return {
            path: this.$history.routes
        }
    },
    watch: {
        '$history.routes'(val) {
            this.path = val;
        }
    }
}