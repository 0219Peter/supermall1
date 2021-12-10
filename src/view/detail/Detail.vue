<template>
   <div id = "detail">
     <detail-nav-bar class="detail-nav" @itemClick="titleClick" ref="nav"></detail-nav-bar>
    
     <scroll class="content" ref="scroll"  :probe-type="3"    @scroll="contentScroll">
     <swiper-detail :top-images="topImages"></swiper-detail>
     <detail-base-info :goods="goods"></detail-base-info>
     <detail-shop-info :shop="shop"></detail-shop-info>
     <detail-goods-info :detail-info="detailInfo"  @imgLoad="imageLoad" ></detail-goods-info>
     <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
     <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
     <goods-list :goods="recommend" ref="list"></goods-list>
    </scroll>
 
    <detail-bottom-bar @addCart = "addCart"></detail-bottom-bar>
    <back-top @click.native="backClick()" v-show="isShowBackTop"></back-top>
   </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import swiperDetail from './childComps/swiperDetail'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import Scroll from 'components/common/scroll/Scroll'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'
    import BackTop from 'components/content/backTop/BackTop'

    import GoodsList from 'components/content/goods/GoodsList'
    import {
        debounce
    } from 'common/utils'
    import {
        itemListenerMixin
    } from 'common/mixin'

    import {
        getDetail,
        Goods,
        Shop,
        Param,
        getRecommend
    } from 'network/detail'
    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            swiperDetail,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            BackTop,
            GoodsList
        },
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: [],
                recommend: [],
                themeTopY: [],
                getThemeTopY: null,
                currentIndex: 0,
                isShowBackTop: false,
            }
        },
        mixins: [itemListenerMixin],
        created() {
            this.iid = this.$route.params.iid

            //请求详情数据
            getDetail(this.iid).then((res) => {
                const data = res.result

                this.topImages = res.result.itemInfo.topImages
                    // console.log(res);
                    //获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

                //创建店铺信息的对象
                this.shop = new Shop(data.shopInfo)

                //保存详情数据
                this.detailInfo = data.detailInfo

                //获取参数信息
                this.paramInfo = new Param(data.itemParams.info, data.itemParams.rule)

                //取出评论信息
                if (data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list
                }
                //值不对
                // this.$nextTick(() => {
                //     this.themeTopY = []

                //     this.themeTopY.push(0)
                //     this.themeTopY.push(this.$refs.param.$el.offsetTop)
                //     this.themeTopY.push(this.$refs.comment.$el.offsetTop)
                //     this.themeTopY.push(this.$refs.list.$el.offsetTop)
                //     console.log(this.themeTopY);
                // })
            })


            //请求推荐数据
            getRecommend().then(res => {
                console.log(res);
                this.recommend = res.data.list
            })

            //给getThemeTopY赋值
            this.getThemeTopY = debounce(() => {
                this.themeTopY = []
                this.themeTopY.push(0)
                this.themeTopY.push(this.$refs.param.$el.offsetTop)
                this.themeTopY.push(this.$refs.comment.$el.offsetTop)
                this.themeTopY.push(this.$refs.list.$el.offsetTop)
                    //可简化下面的if语句
                this.themeTopY.push(Number.MAX_VALUE)
                console.log(this.themeTopY);
            }, 100)

        },
        mounted() {

        },
        methods: {
            imageLoad() {
                this.$refs.scroll.refresh()
                this.getThemeTopY()

            },
            titleClick(index) {
                // console.log(index);
                this.$refs.scroll.scrollTo(0, -this.themeTopY[index], 200)
            },
            contentScroll(position) {
                // console.log(position);
                const positionY = -position.y

                //positionY和主题中的y值进行对比
                let length = this.themeTopY.length
                for (let i = 0; i < length; i++) {
                    if (this.currentIndex !== i && (i < length - 1 && positionY > this.themeTopY[i] && positionY < this.themeTopY[i + 1]) ||
                        (i === length - 1 && positionY > this.themeTopY[i])) {
                        this.currentIndex = i;
                        this.$refs.nav.currentIndex = this.currentIndex
                    }
                }

                //是否回到顶部

                //判断backtop是否显示
                this.isShowBackTop = (-position.y) > 1000

            },
            backClick() {
                this.$refs.scroll.scrollTo(0, 0)

            },
            addCart() {
                //1.获取购物车信息
                const product = {}
                product.image = this.topImages[0]
                product.title = this.goods.title;
                product.desc = this.goods.desc
                product.price = this.goods.realPrice
                product.iid = this.iid
                console.log(product);
                //将商品添加到购物车
                this.$store.commit('addCart', product)
                    // this.$store.dispatch('addCart', product)
            }
        },


    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 20;
        background-color: #fff;
        height: 100vh;
    }
    
    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    
    .content {
        height: calc(100% - 44px - 49px);
    }
</style>