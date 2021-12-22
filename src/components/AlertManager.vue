<template>
  <div
    class="fixed-bottom container-fluid alert alert-danger mb-4"
    role="alert"
    v-if="myAlertMessage"
  >
    {{myAlertMessage}}
  </div>
</template>

<script>
export default {
    name: 'alert-manager',
    setup() {
        
    },
    props:{
        myAlertMessage : String
    }
};
</script>

<style>
</style>