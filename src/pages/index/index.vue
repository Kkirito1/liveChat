<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
      <view class="input-content">
        <input type="text" class="nickname" placeholder="请输入昵称" v-model="nickname" />
        <input type="text" class="customer-id" placeholder="请输入用户ID" v-model="customerId" />
      </view>
      <button @click="toLive">进入直播间</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
      nickname: '',
      customerId: ''
    }
  },
  onLoad() {},
  methods: {
    toLive() {
      if(!this.nickname) {
        return uni.showToast({
        title: '请先输入昵称',
        icon:'none',
        duration: 2000
        });
      }
      if(!this.customerId) {
        return uni.showToast({
        title: '请先输入用户ID',
        icon:'none',
        duration: 2000
        });
      }
      // "/pages/instant-messaging/instant-messaging?transactionType='1'&status='3'&tradeMoney='123'&tradeNum=''000123456"
      uni.navigateTo({
        url: "/pages/instant-messaging/instant-messaging?transactionType='1'&status='3'&tradeMoney="+ this.nickname + "&tradeMoney="+ this.customerId
      })
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin: 200rpx auto 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  color: #8f8f94;
  font-size: 36rpx;
}

.input-content {
  margin: 10px 0;
}

.nickname,
.customer-id {
  height: 20px;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #ececec;
  border-radius: 4px;
}
</style>
