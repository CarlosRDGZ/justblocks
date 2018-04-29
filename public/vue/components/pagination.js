Vue.component('pagination', {
  props:['message'],
  template: `
  <div>
    <div class="container">
      <div class="content">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
  `
})