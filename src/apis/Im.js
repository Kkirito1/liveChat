import { imService } from '@/utils/request/index'

export default {
  // IM消息分布式地址
  getImSocketUrl() {
    return imService({
      url: '/mgr/msgserver/get',
      method: 'get',
    })
  },

  // IM消息推送
  sendGroup: (params) => {
    const { agentName, conversationId, fromClient, message } = params
    return imService({
      url: '/message/send/group',
      method: 'post',
      data: {
        agentName, // 系统代理
        conversationId, // 会话id
        fromClient, // 发送人
        message, // 消息主体
      },
    })
  },

  // 离线消息
  offline: (params) => {
    const { agentName, username } = params
    return imService({
      url: '/message/offline',
      method: 'post',
      data: {
        agentName, // 系统代理
        username, // 用户唯一标识别
      },
    })
  },

  // 历史消息
  history: (params) => {
    const { agentName, conversationId, username, time, limit } = params
    return imService({
      url: '/message/history',
      method: 'post',
      data: {
        agentName, // 系统代理
        username, // 用户唯一标识别
        conversationId, // 会话id
        time, // 时间
        limit, // 每页几个
      },
    })
  },
}
