<template>
  <div id="home" class="wrapper">
      <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
      <tab-control :titles="['流行','新款','精选']"  class="tab-control" @tabClick="tabClick"
      ref="tabControl1"  v-show="isTabControl"></tab-control>
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
     @pullingUp = "loadMore">
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control :titles="['流行','新款','精选']"   @tabClick="tabClick"
    ref="tabControl2"  ></tab-control>
    <goods-list :goods ="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick()" v-show="isShowBackTop"></back-top>
    
  </div>
</template>

<script>
    import HomeSwiper from './childComps/HomeSwiper';
    import RecommendView from './childComps/RecommendView';
    import FeatureView from './childComps/FeatureView'

    import NavBar from 'components/common/navbar/NavBar';
    import TabControl from 'components/content/tabControl/TabControl';
    import GoodsList from 'components/content/goods/GoodsList'

    import Scroll from 'components/common/scroll/Scroll'
    import BackTop from 'components/content/backTop/BackTop'
    import {
        debounce
    } from 'common/utils'
    import {
        itemListenerMixin
    } from 'common/mixin'


    import {
        getHomeMultidata,
        getHomeGoods
    } from "network/home";
    export default {
        name: "Home",
        components: {
            NavBar,
            HomeSwiper,
            RecommendView,
            FeatureView,
            TabControl,
            GoodsList,
            Scroll,
            BackTop
        },
        data() {
            return {
                banners: [],
                recommends: [],
                goods: {
                    'pop': {
                        page: 0,
                        list: []
                    },
                    'new': {
                        page: 0,
                        list: []
                    },
                    'sell': {
                        page: 0,
                        list: []
                    },
                },
                currentType: 'pop',
                isShowBackTop: false,
                tabOffsetTop: 0,
                isTabControl: false,
                savey: 0,


            }
        },
        mixins: [itemListenerMixin],
        computed: {
            showGoods() {
                return this.goods[this.currentType].list
            },
            activated() {
                this.$refs.scroll.scrollTo(0, this.savey, 0)
                this.$refs.scroll.refresh()
            },

            deactivated() {
                //保存y值
                this.savey = this.$refs.scroll.getScrollY()

                //取消全局事件的监听
                this.$bus.off('itemImageLoad', this.ItemImgListener)
            }
        },
        created() {
            this.getHomeMultidata(),
                this.getHomeGoods('pop'),
                this.getHomeGoods('new'),
                this.getHomeGoods('sell')


        },
        mounted() {

            //赋值
            // this.tabOffsetTop = this.$refs.TabControl
        },
        methods: {


            //事件监听
            tabClick(index) {
                switch (index) {
                    case 0:
                        this.currentType = 'pop'
                        break
                    case 1:
                        this.currentType = 'new'
                        break
                    case 2:
                        this.currentType = 'sell'
                        break
                }
                //让两个TabControl保持一致
                this.$refs.tabControl1.currentIndex = index
                this.$refs.tabControl2.currentIndex = index
            },

            backClick() {
                this.$refs.scroll.scrollTo(0, 0)

            },

            contentScroll(position) {
                // console.log(position);
                //判断backtop是否显示
                this.isShowBackTop = (-position.y) > 1000

                //决定tabControl是否吸顶(position:fixed)
                this.isTabControl = (-position.y) > this.tabOffsetTop
            },

            loadMore() {
                // console.log('上拉记载');
                this.getHomeGoods(this.currentType)

            },
            swiperImageLoad() {
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
            },

            // 网络请求
            //1.请求多个数据
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    // console.log(res);
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list;
                })
            },
            //2.请求商品数据
            getHomeGoods(type) {
                const page = this.goods[type].page + 1
                getHomeGoods(type, page).then((res) => {
                    console.log(res);
                    this.goods[type].list.push(...res.data.list)
                    this.goods[type].page += 1

                    this.$refs.scroll.finishPullUp()
                })
            },

        }
    }
</script>

<style scoped>
    #home {
        /* padding-top: 44px; */
        height: 100vh;
        position: relative;
    }
    
    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
        /* position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9; */
    }
    
    .tab-control {
        position: relative;
        z-index: 9;
    }
    
    .content {
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }
</style>