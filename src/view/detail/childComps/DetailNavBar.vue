<template>
  <div >
    <nav-bar >
      <div slot="left" class="back" @click="backClick">
        <img src="../../../assets/img/common/back.svg">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in title" class="title-item" :class="{active:index === currentIndex}"
          @click = "itemClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar></div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'

    export default {
        name: "DetailNavBar",
        components: {
            NavBar
        },
        data() {
            return {
                title: ['商品', '参数', '评论', '详情'],
                currentIndex: 0
            }
        },
        methods: {
            itemClick(index) {
                this.currentIndex = index
                this.$emit('itemClick', index)
            },
            backClick() {
                //或者this.$router.back()
                this.$router.go(-1)

            }
        }
    }
</script>

<style scoped>
    .title {
        display: flex;
        font-size: 13px;
    }
    
    .title-item {
        flex: 1;
    }
    
    .active {
        color: red;
    }
    
    .back {
        margin-top: 9px;
    }
</style>