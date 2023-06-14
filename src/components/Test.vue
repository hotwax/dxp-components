Vue.component('my-checkbox', {
  data() {
    return { checked: false, title: 'Check me' }
  },
  methods: {
    check() { this.title = 'sample' }
  },
  render() {
    return <div class="checkbox-wrapper" onClick={ this.check }>
            <div class="title">{ this.title }</div>
          </div>
  }
});