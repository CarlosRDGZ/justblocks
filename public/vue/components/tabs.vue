<template lang="pug">
  .container
    p.title {{ item. title }}
</template>

<script>
export default {
  name: 'test',

  data() {
    return {
      item: {
        title: 'Titulo de prueba'
      }
    }
  }
}
</script>
