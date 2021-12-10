import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
//1.安装插件
Vue.use(Vuex)

//创建store对象
const store = new Vuex.Store({
    state: {
        cartList: []
    },
    mutations: {
        //mutations唯一目的就是修改state的状态
        addCounter(state, payLoad) {
            payLoad.count++
        },
        addToCart(state, payLoad) {
            state.cartList.push(payLoad)
        },
        addCart(state, payload) {
            // let oldProduct = null;
            // for(let item of state.cartList){
            // 	if(item.iid === payload.iid){
            // 		oldProduct = item
            // 	}
            // }
            //数组find()方法
            let oldProduct = state.cartList.find(function(item) {
                return item.iid === payload.iid
            })
            if (oldProduct) {
                oldProduct.count += 1;
            } else {
                payload.count = 1;
                payload.checked = true;
                state.cartList.push(payload)
            }
            // state.cartList.push(payload)
            // console.log(payload);
        }

    },
    actions: {
        // addCart(context, payLoad) {
        //     //查找数组中是否有该物品
        //     let oldProduct = context.state.cartList.find(item => item.iid === payLoad.iid)

        //     //判断oldProduct
        //     if (oldProduct) {
        //         // oldProduct.count += 1
        //         context.commit('addCounter', oldProduct)
        //     } else {
        //         payLoad.count = 1
        //             // context.state.cartList.push(payLoad)
        //         payload.checked = true;
        //         context.commit('addToCart', payLoad)
        //     }
        // }
    },
    getters
})

//3.挂载vue实例上
export default store