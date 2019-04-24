<template>
	<component v-bind:is="layout"></component>
</template>

<script>
import Layout from "./components/layout";
export default {
  name: "app",
  components: {
		default: Layout
	},
  computed: {
		layout() {
			return 'default';
		}
	},
}
</script>
