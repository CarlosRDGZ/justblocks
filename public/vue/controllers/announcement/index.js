// import Vue from "vue";
const vm = new Vue({
  el: '#app', 
  data: {
    items: [],
    pagination: {
      current: 0,
      pags: 0,
      itemsPerPage: 9,
      shown: {
        first: -1,
        last: -1,
        pages: []
      }
    },
    content: {
      data: [],
      index: {
        top: -1,
        bottom: -1
      }
    },
    url: 'http://127.0.0.1:3000/'
  },
  methods: {
    paginations: function(self = this) {
      return {
        previous: function() {
          if (self.pagination.current > 1) {
            self.pagination.current--
            self.content.data = 
              self.items.slice(self.content.index.top -= self.pagination.itemsPerPage, self.content.index.bottom -= self.pagination.itemsPerPage)
              if (self.pagination.current < self.pagination.shown.first){
                self.pagination.shown.pages.unshift(self.pagination.current)
                self.pagination.shown.pages = self.pagination.shown.pages.slice(0,self.pagination.shown.pages.length-1)
                self.pagination.shown.first--
                self.pagination.shown.last--
              }
          }
        },
        next: function() {
          if (self.pagination.current < self.pagination.pags) {
            self.pagination.current++
            self.content.data = 
              self.items.slice(self.content.index.top += self.pagination.itemsPerPage, self.content.index.bottom += self.pagination.itemsPerPage)
            if (self.pagination.current > self.pagination.shown.last){
              self.pagination.shown.pages.push(self.pagination.current)
              self.pagination.shown.pages = self.pagination.shown.pages.slice(1)
              self.pagination.shown.first++
              self.pagination.shown.last++
            }
          }
        },
        goto: function(page) {
          self.pagination.current = page
          self.content.index.top = (self.pagination.itemsPerPage * page) - self.pagination.itemsPerPage
          self.content.index.bottom = self.pagination.itemsPerPage * page
          self.content.data =
            self.items.slice(self.content.index.top, self.content.index.bottom)
        },
        first: function() {
          self.pagination.shown.first = 1
          self.pagination.shown.last = 10
          self.pagination.shown.pages = []
          for (let i = self.pagination.shown.first; i <= self.pagination.shown.last; i++)
            self.pagination.shown.pages.push(i)
            this.goto(1)
        },
        last: function() {
          self.pagination.shown.first = self.pagination.pags - 9
          self.pagination.shown.last = self.pagination.pags
          self.pagination.shown.pages = []
          for (let i = self.pagination.shown.first; i <= self.pagination.shown.last; i++)
            self.pagination.shown.pages.push(i)
          this.goto(self.pagination.pags)
        }
      }
    },
    setLenght: function(str, limit) {
      if(str.length > limit)
        str = str.substring(0, limit - 4) + "...";
      return str;
    }
  },
  created: function() {
    console.log('Before Mount')
    //Con la url no funcionaba
    window.axios(`${this.url}api/announcement`)
      .then(res => {
        for (var i = res.data.length - 1; i >= 0; i--) {
          res.data[i].title = this.setLenght(res.data[i].title, 23);
          res.data[i].author = this.setLenght("Convoca: " + res.data[i].author, 36);
        }
        let announs = res.data
        // announs = res.data
        this.items = announs
        this.pagination.pags = Math.ceil(announs.length / this.pagination.itemsPerPage)
        this.pagination.current = announs.length > 0 ? 1 : 0
        this.content.data = this.items.slice(this.content.index.top = 0, this.content.index.bottom = this.pagination.itemsPerPage)
        this.pagination.shown.first = this.pagination.current
        this.pagination.shown.last = Math.min(this.pagination.pags,10)
        for(let i = this.pagination.shown.first; i <= this.pagination.shown.last; i++)
        this.pagination.shown.pages.push(i)
      })
      .catch(err => console.log(err))
  }
})