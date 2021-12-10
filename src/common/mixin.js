import {
    debounce
} from 'common/utils'


export const itemListenerMixin = {
    data() {
        return {
            ItemImgListener: null
        }
    },
    mounted() {
        const refresh = debounce(this.$refs.scroll.refresh)
            //监听事件

        //对监听事件进行一个保存
        this.ItemImgListener = () => {
            refresh()
        }
        this.$bus.$on('ItemimageLoad', this.ItemImgListener)
            // console.log('我是混入中的内容');
    }
}