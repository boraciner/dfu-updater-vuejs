<template>
    <ul class="list-group deviceInfoList">
        <li class="list-group-item bg-dark text-light">Device Information:</li>
        <li class="list-group-item">{{productName}}</li>
        <li class="list-group-item">{{manufacturerName}}</li>
    </ul>
</template>


<script>
export default {
    name: 'device-information',
    props: {
        productName : String,
        manufacturerName : String
    },
}
</script>