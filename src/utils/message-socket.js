/**
 * @name Import libs
 */
import io from '@hyoga/uni-socket.io'

/**
 * @name Import Files
 */
import store from '@/store'
// import { handleApiRequestException } from '@/utils/handle-error'
// import { Account } from '@/apis'
// import getEnv from '@/config'
// import { SOCKET_SOURCE } from '@/constant'
import { toast } from '@/utils'
// const { customerId } = store.state.userInfo

/**
 * @description 一定会返回一个 socket 对象，使用需要判断连接状态
 * @param {Object}
 *  {
 *    serverName: null,
 *    host: null,
 *    port: null,
 *    connCount: null
 *  }
 */
export function CreateMessageSocket() {
  console.log('CreateMessageSocket')
  const socket = io(`ws://192.168.100.7:8844`, {
    path: '/message',
    transports: ['websocket', 'polling'],
  })
  console.log('socket+++++++++++++++++',socket)
  socket.on('connect', () => {
    console.log('连接了')
    socket.emit('init', JSON.stringify({ agent: 'bandex', source: 'app' }))
    console.log('CreateMessageSocket-----------')

    // 处理刷新页面,再发一次登录的指令
    // async function getUser() {
    //   try {
    //     const res = await Account.getUser()
    //     if (res.success) {
    //       socket.emit(
    //         'login',uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu 
    //         JSON.stringify({
    //           agent: 'bandex',
    //           username: '483231',
    //           source: 'app',
    //         })
    //       )
    //     }
    //   } catch (error) {
    //     handleApiRequestException(error)
    //   }
    // }
    // if (store.state.token) {
    //   getUser()
    // }
  })

  socket.on('BROADCAST_EVENT', (data) => {
    // console.log('BROADCAST_EVENT', data.msgBody)
    const str = decodeURIComponent(data.msgBody)
    // 利用正则表达式，找出标签，然后用空字符串替换。
    const pattern = /<[^>]+>/g
    str.match(pattern) // 返回匹配到的标签数组
    // 判断是否有标签，完成替换取值
    const message = str.match(pattern) && str.match(pattern).length > 0 ? str.replace(/<[^>]+>/g, '') : str
    toast(message, {
      duration: 5000,
    })
    // store.dispatch('GET_IS_TOAST')
  })

  socket.on('NOTIFY_EVENT', (data) => {
    // console.log('NOTIFY_EVENT', data.msgBody)
    const str = decodeURIComponent(data.msgBody)
    // 利用正则表达式，找出标签，然后用空字符串替换。
    const pattern = /<[^>]+>/g
    str.match(pattern) // 返回匹配到的标签数组
    // 判断是否有标签，完成替换取值
    const message = str.match(pattern) && str.match(pattern).length > 0 ? str.replace(/<[^>]+>/g, '') : str
    toast(message, {
      duration: 5000,
    })
    // store.dispatch('GET_IS_TOAST')
  })

  // 发送的消息返回
  socket.on('CHAT_MESSAGE_EVENT', (data) => {
    console.log('CHAT_MESSAGE_EVENT', data.msgBody)
    // 存入vuex
    store.commit('CHAT', data)
  })

  // 心跳检查
  socket.on('CHECK_HEART_EVENT', (data) => {
    if (!data.isOnline) {
      socket.emit('init', JSON.stringify({ agent: 'bandex', source: 'app' }))
      socket.emit('login', JSON.stringify({ agent: 'bandex', username: '483231', source: 'app' }))
    }
  })
  return socket
}

export const $messageSocket = CreateMessageSocket()
