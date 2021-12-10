<template>
      <div class="tab-bar">
        <slot></slot>
      </div>

</template>

<script>
    export default {
        name: 'TabBar',
        components: {

        }
    }
</script>

<style>
    .tab-bar {
        display: flex;
        background-color: #ccc;
        position: fixed;
        right: 0;
        left: 0;
        bottom: 0;
        box-shadow: 0px -1px 1px rgba(100, 100, 100, .8);
        z-index: 9;
    }
</style>