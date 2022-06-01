import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 聊天内容
    chat: [],
  },
  mutations: {
    //  离线和发送的消息
    CHAT(state, data) {
      state.chat.push(data)
    },
    //  历史消息
    HISTORY_MESSAGE(state, data) {
      state.chat.unshift(data)
    },
  },
  getters:{
    getChat: (state) => {
      // 创建一个map数据
      const data = new Map()
      //  循环chat数组
      for (const item of state.chat) {
        if (data.has(item.conversationId)) {
          data.get(item.conversationId).push(item)
        } else {
          const arrdata = []
          arrdata.push(item)
          data.set(item.conversationId, arrdata)
        }
      }
      // 返回封装的map数据
      return data
    },
  }
})