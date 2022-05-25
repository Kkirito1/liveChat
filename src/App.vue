<script>
import io from '@hyoga/uni-socket.io'

export default {
  onLaunch: function () {
    console.log('App Launch1111')
    const socket = io(`wss://192.168.100.7:8844}`, {
      path: '/message',
      transports: ['websocket', 'polling'],
    })
    // 处理刷新页面,再发一次登录的指令
    socket.emit(
      'login',
      JSON.stringify({
        agent: 'bandex',
        username: '483231',
        source: 'app',
      })
    )
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
