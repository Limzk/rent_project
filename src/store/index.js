import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        index: 1,
        location:[],
    },
    mutations:{
        changIndexMu(state,index){
            state.index = index
        },
        changLocationMu(state,location) {
            state.location = location
            console.log(state.location)
        }
    },
    actions:{
        changIndexAc(context,index){
            context.commit('changIndexMu',index)
        },
        changLocationAc(context,location){
            context.commit('changLocationMu',location)
        }
    }
})

export default store