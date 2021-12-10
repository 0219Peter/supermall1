<template>
 <div class="wrapper" ref="wrapper">
   <div class="content">
    <slot></slot>
   </div>

 </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: "Scroll",
        props: {
            probeType: {
                Type: Number,
                default: 0
            },
            pullUpLoad: {
                Type: Boolean,
                default: false
            }
        },
        data() {
            return {
                scroll: null
            }
        },
        mounted() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                    click: true,
                    probeType: this.probeType,
                    pullUpLoad: this.pullUpLoad
                }),
                this.scroll.on('scroll', (position) => {
                    // console.log(position);
                    this.$emit('scroll', position)
                })

            //监听上拉加载
            this.scroll.on('pullingUp', () => {
                this.$emit('pullingUp')
            })

            //监听scroll滚动到底部
            if (this.pullUpLoad) {
                this.scroll.on('pullingUp', () => {
                    // console.log('监听到底部');
                    this.$emit('pullingUp')
                })
            }

        },
        methods: {
            scrollTo(x, y, time = 300) {
                this.scroll.scrollTo(x, y, time)
            },
            finishPullUp() {
                this.scroll.finishPullUp()
            },
            refresh() {
                console.log('---');
                this.scroll.refresh()
            },
            getScrollY() {
                return this.scroll ? this.scroll.y : 0
            }
        }
    }
</script>

<style scoped>

</style>