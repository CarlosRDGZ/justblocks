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
    }
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
    }
  },
  created: function() {
    console.log('Before Mount')
    const url = 'http://127.0.0.1:3000/'
    window.axios(`${url}api/announcement/`)
      .then(res => {
        let announs = [
          'item1',
  'item2',
  'item3',
  'item4',
  'item5',
  'item6',
  'item7',
  'item8',
  'item9',
  'item10',
  'item11',
  'item12',
  'item13',
  'item14',
  'item15',
  'item16',
  'item17',
  'item18',
  'item19',
  'item20',
  'item21',
  'item22',
  'item23',
  'item24',
  'item25',
  'item26',
  'item27',
  'item28',
  'item29',
  'item30',
  'item31',
  'item32',
  'item33',
  'item34',
  'item35',
  'item36',
  'item37',
  'item38',
  'item39',
  'item40',
  'item41',
  'item42',
  'item43',
  'item44',
  'item45',
  'item46',
  'item47',
  'item48',
  'item49',
  'item50',
  'item51',
  'item52',
  'item53',
  'item54',
  'item55',
  'item56',
  'item57',
  'item58',
  'item59',
  'item60',
  'item61',
  'item62',
  'item63',
  'item64',
  'item65',
  'item66',
  'item67',
  'item68',
  'item69',
  'item70',
  'item71',
  'item72',
  'item73',
  'item74',
  'item75',
  'item76',
  'item77',
  'item78',
  'item79',
  'item80',
  'item81',
  'item82',
  'item83',
  'item84',
  'item85',
  'item86',
  'item87',
  'item88',
  'item89',
  'item90',
  'item91',
  'item92',
  'item93',
  'item94',
  'item95',
  'item96',
  'item97',
  'item98',
  'item99',
        ]
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