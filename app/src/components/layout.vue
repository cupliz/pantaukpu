<template>
  <div>
    <Header/>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script>
import Header from "./header.vue"
import Footer from "./footer.vue"
export default {
  components: {
    Header,
    Footer
  },
}
</script>