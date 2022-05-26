<script>
import { $messageSocket } from '@/utils/message-socket'

export default {
  onLaunch: function () {
    console.log('App Launch1111',$messageSocket, $messageSocket.connected == true)
    if ($messageSocket) {
      console.log('App Launch2222')
      $messageSocket.emit(
        'login',
        JSON.stringify({
          agent: 'bandex',
          username: '483231',
          source: 'app',
        })
      )
    }
    // const socket = io(`ws://192.168.100.7:8844}`, {
    //   path: '/message',
    //   transports: ['websocket', 'polling'],
    // })
    // // 处理刷新页面,再发一次登录的指令
    // socket.emit(
    //   'login',
    //   JSON.stringify({
    //     agent: 'bandex',
    //     username: '483231',
    //     source: 'app',
    //   })
    // )
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 每个页面公共css */
</style>
