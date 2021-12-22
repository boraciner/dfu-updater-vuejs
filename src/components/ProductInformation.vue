<template>
  <ul class="list-group" v-if="productIsOK && readyToGetProductInfo">
    <li class="list-group-item bg-dark text-light">Product Information:</li>
    <li class="list-group-item">Rev Signiture: {{myProductInfo.revSigniture}}</li>
    <li class="list-group-item">HW ID: {{myProductInfo.hwId}} / {{myProductInfo.hwSubId}}</li>
    <li class="list-group-item">Revision: {{myProductInfo.revision}}</li>
    <li class="list-group-item">Features: {{myProductInfo.features}}</li>
    <li class="list-group-item">Serial: {{myProductInfo.serial}}</li>
    <li class="list-group-item">Firmware Date: {{myProductInfo.day}}/{{myProductInfo.month}}/{{myProductInfo.year}}</li>
  </ul>
</template>

<script>
export default {
  name: "ProductInformation",
  data() {
    return {
      productIsOK : false,
      myProductInfo : {},
    };
  },
  props: {
    appUpdater : {},
    readyToGetProductInfo: Boolean,
  },
  watch: {
    readyToGetProductInfo(value) {
      if (value) {
        this.appUpdater.readInformationBlock().then(obj=>{
          this.myProductInfo = obj
          this.productIsOK = true
        }
        )
      }
    },
  },
};
</script>

<style>
</style>
