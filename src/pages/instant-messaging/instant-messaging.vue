<template>
  <view>
    <view class="instant-messaging" style="height: 100%">
      <uni-nav-bar status-bar="true" @clickLeft="back" fixed>
        <view style="color: red; font-size: 18px">直播中</view>
        <c-icon slot="left" name="iconfanhui" size="22" color="#000"></c-icon>
      </uni-nav-bar>

      <view
        :style="{ bottom: bottomHeight }"
        style="position: relative; overflow-y: hidden"
        @click="relativeClick"
        @touchmove="relativeTouchMove"
      >
        <view class="status-text" style="color: #333">交易金额</view>
        <view class="status-text" style="color: #3f81ff">{{ tradeMoney }}CNY</view>
        <scroll-view
          id="scroll_xy"
          :style="{ height: scrollYHeight }"
          scroll-with-animation="true"
          :scroll-y="true"
          :scroll-into-view="intoindex"
          :scroll-top="scrollTop"
          @scroll="scrollView"
        >
          <!-- 内容 -->
          <view
            id="test"
            class="im-list"
            ref="test"
            :class="faceShow ? 'contentBox contFaceShow' : 'contentBox'"
            :style="{
              'padding-bottom': status == 5 || status == 14 ? '131px' : '50px',
            }"
          >
            <!-- 点击查看历史消息 -->
            <view class="im-loading">
              <text id="historyText" ref="historyText" class="loading-text" @click="rolling ? history() : ''">{{
                historyMessage
              }}</text>
            </view>
            <!-- 消息展示-->
            <view v-for="(item, index) in myNewsList" :key="index" :id="'text' + index">
              <!-- 系统消息 -->
              <view v-if="item.fromClient == 'system'" class="system">
                <text>{{ $moment(item.created).format('YYYY-MM-DD HH:mm:ss') }}</text>
                <text class="system-text"
                  >{{ JSON.parse(item.msgBody).userName }}{{ $t(JSON.parse(item.msgBody).message) }}</text
                >
              </view>
              <!-- 聊天消息 -->
              <view
                v-if="item.fromClient != 'system'"
                class="own keepleft"
                :class="{ keepright: item.fromClient == fromClient }"
              >
                <!-- 对方的头像 -->
                <view v-if="item.fromClient != fromClient" class="opposite-left">
                  <ssx-string-avatar
                    :text="buyorsale === 1 ? sellerName : buyerName"
                    font-size="18px"
                    auto-size="true"
                  />
                </view>
                <!-- 内容 -->
                <view
                  v-if="item.fromClient != 'system'"
                  class="own-center"
                  :class="{
                    centerupt: item.fromClient != fromClient,
                  }"
                >
                  <view
                    v-if="JSON.parse(item.msgBody).type == 0"
                    class="own-hd bgleft"
                    :class="{ bgright: item.fromClient == fromClient }"
                  >
                    <text class="showcontents" selectable="true">{{
                      decodeURIComponent(JSON.parse(item.msgBody).message)
                    }}</text>
                  </view>
                  <view v-if="JSON.parse(item.msgBody).type == 1" class="images-box">
                    <image
                      :src="ALIOSS_URLS + JSON.parse(item.msgBody).message"
                      @tap="previewImage(ALIOSS_URLS + JSON.parse(item.msgBody).message)"
                    />
                  </view>
                  <view v-if="item.fromClient != fromClient" class="own-bd-left">
                    {{ $moment(item.created).format('MM-DD HH:mm:ss') }}
                  </view>
                  <view v-if="item.fromClient == fromClient" class="own-bd-right">
                    {{ $moment(item.created).format('MM-DD HH:mm:ss') }}
                  </view>
                </view>
                <!-- 自己的头像 -->
                <view v-if="item.fromClient == fromClient" class="own-right">
                  <ssx-string-avatar
                    background-color="#00A0E9"
                    :text="buyorsale === 1 ? buyerName : sellerName"
                    font-size="18px"
                    auto-size="true"
                  />
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 底部 -->
      <view v-if="status != 5 && status != 14" ref="heightFace" class="footer" :class="faceShow ? 'boxFaceShow' : ''">
        <view class="footer-left">
          <view class="uni-textarea">
            <textarea
              placeholder-style="color:#666;font-size:14px;"
              placeholder="请输入发送内容"
              v-model="textMsg"
              maxlength="200"
              :adjust-position="true"
              :focus="focusFlag"
              @focus="textareaFocus"
              @keyboardheightchange="keyboardHeightChanged"
            />
          </view>
          <view class="entry-right">
            <c-icon @click="faceContent" class="entry-icon" name="iconbiaoqing" size="22" color="#666"></c-icon>
            <c-icon @click="chooseImage" class="entry-icon" name="iconxiangce" size="22" color="#666"></c-icon>
            <c-icon class="entry-icon" name="icontianjia" size="22" color="#666"></c-icon>
          </view>
        </view>
        <view class="footer-right" @click="sendTextMsg"> 发送 </view>
      </view>
      <!-- end -->

      <view v-else class="tips">
        <view>
          您的订单
          <text class="tips-text">{{ status == 5 ? '已取消' : '已完成' }}</text>
        </view>
        <view>对方已下线</view>
        <view>不能进行聊天了哦！</view>
      </view>
      <!-- 表情区域 -->
      <view v-if="faceShow" class="browBox">
        <ul>
          <li v-for="(item, index) in faceList" :key="index" @click="getBrow(index)">
            {{ item }}
          </li>
        </ul>
      </view>
    </view>
  </view>
</template>

<script>
// import { mapGetters, mapState } from 'vuex'
import appData from '@/static/json/emojis/emojis.json'
import SsxStringAvatar from '@/components/SsxStringAvatar/SsxStringAvatar.vue'
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
export default {
  name: 'instantMessaging',
  components: {
    uniNavBar,
    SsxStringAvatar,
  },
  props: {
    orderInfo: Object,
    orderAccounting: Function,
  },
  data() {
    return {
      bottomHeight: '40',
      scrollYHeight: '200',
      scrollTop: 0,
      old: {
        scrollTop: 99999,
      },
      focusFlag: false,
      intoindex: '',
      windowHeight: '',
      statusBarHeight: '',
      historyMessage: '点击查看历史消息',
      tradeMoney: '', // 交易金额
      status: '', // 交易状态
      transactionMode: 1, // 交易方式：1 购买 2 出售
      agentName: 'bandex', // 系统代理
      // fromClient: this.$store.state.userInfo.customerId, // 发送人
      textMsg: '', // 发送的内容
      time: '', // 历史消息的时间
      limit: 6, // 历史消息的条数
      loading: false, // 是否加载
      rolling: true, // 是否有历史消息
      // emojis
      content: [],
      faceList: [],
      faceShow: false,
      getBrowString: '',
      ALIOSS_URLS: '',
      tradeNum: '',
      dialogueId: '', // 会话id
      buyerId: 0, // 买家id
      sellerId: 0, // 卖家id
      buyerName: '', // 买家名字
      sellerName: '', // 卖家名字
      buyorsale: 0, // 判断是否买家还是卖家 默认0页面不显示
      lastTime: '',
    }
  },
  mounted() {
    console.log('直播间')
    this.ALIOSS_URLS = 'https://bandex-dev.oss-cn-shenzhen.aliyuncs.com/'
  },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    this.tradeMoney = option.tradeMoney
    this.transactionMode = option.transactionType
    this.status = option.status
    this.tradeNum = option.tradeNum
  },
  onReady() {
    var that = this
    uni.getSystemInfo({
      success(res) {
        that.windowHeight = res.windowHeight
        that.statusBarHeight = res.statusBarHeight
        // that.getInfo()
      },
    })
  },
  computed: {
    // ...mapState,
    // 消息列表
    myNewsList: {
      get() {
        //     let dialogueId = this.dialogueId
        //     let val = this.getChatData.get(dialogueId) || []
        //     if (val.length > 0) {
        //       // let lastSendTime = val[val.length - 1].created || ''
        //       // if (this.lastTime !== lastSendTime) {
        //       //   this.lastTime = lastSendTime
        //       // }
        //       // this.scrollToBottom()
        //       let systemMsg = JSON.parse(val[val.length - 1].msgBody)
        //       if ('tradeType' in systemMsg && val[val.length - 1].conversationId === dialogueId) {
        //         this.orderDetails()
        //       }
        //     }
        //     return this.getChatData.get(dialogueId) || []
        return []
      },
    },
    // ...mapGetters({
    //   getChatData: 'getChat',
    //   themeVal: 'themeVal',
    // }),
  },
  methods: {
    getInfo() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('#scroll_xy')
        .boundingClientRect((data) => {
          data.height = this.windowHeight - this.statusBarHeight - 120 + 'px'
          this.scrollYHeight = data.height
        })
        .exec()
    },
    scrollView(e) {
      if (e.detail.deltaY > 0) {
        uni.hideKeyboard()
        this.bottomHeight = '0px'
        this.faceShow = false
        this.focusFlag = false
      }
    },
    relativeClick() {
      this.bottomHeight = '0px'
      if (this.faceShow) {
        this.faceShow = false
      }
    },
    relativeTouchMove() {
      uni.hideKeyboard()
      this.faceShow = false
      this.focusFlag = false
      this.bottomHeight = '0px'
    },
    // 订单详情
    async orderDetails() {
      try {
        const res = await this.$api.Otc.orderAccounting({
          tradeNum: this.tradeNum,
        })
        if (res.success) {
          this.dialogueId = res.obj.app.conversationId
          if (this.transactionMode == 1) {
            this.buyerId = res.obj.app.takerUserId
            this.buyerName = res.obj.app.takerUserName
            this.sellerId = res.obj.app.makerUserId
            this.sellerName = res.obj.app.makerUserName
          } else if (this.transactionMode == 2) {
            this.buyerId = res.obj.app.makerUserId
            this.buyerName = res.obj.app.makerUserName
            this.sellerId = res.obj.app.takerUserId
            this.sellerName = res.obj.app.takerUserName
          }
          if (this.$store.state.userInfo.customerId == this.buyerId) {
            // 买方
            this.buyorsale = 1
          } else {
            // 卖方
            this.buyorsale = 2
          }
        } else {
          this.$util.toast(this.$t(res.msg))
        }
      } catch (e) {
        this.$handleError.handleApiRequestException(e)
      }
    },
    // 返回
    back() {
      uni.navigateBack({
        delta: 1
      })
    },
    // 选择发送图片
    chooseImage: function () {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          const isLt4M = res.tempFiles[0].size / 1024 / 1024 < 4
          if (!isLt4M) {
            this.$util.toast('图片过大，请重新上传')
            return
          } else {
            const tempFilePaths = res.tempFilePaths[0]
            this.$api.Upload.upload({
              filePath: tempFilePaths,
              name: 'file',
            }).then((res) => {
              if (res.success) {
                if (res.obj) {
                  let picMsg = {
                    type: 1,
                    message: res.obj[0],
                  }
                  this.sendGroup(picMsg)
                } else {
                  this.$util.toast('图片过大，请重新上传')
                }
              } else {
                this.$util.toast(this.$t(res.msg))
              }
            })

            // uni.uploadFile({
            //   url: `${this.$getEnv('BASE_API')}/upload/addPicture`, //仅为示例，非真实的接口地址
            //   filePath: tempFilePaths,
            //   name: 'file',
            //   success: (uploadFileRes) => {
            //     let res = JSON.parse(uploadFileRes.data)
            //     let picMsg = {
            //       type: 1,
            //       message: res.obj[0],
            //     }
            //     this.sendGroup(picMsg)
            //     // this.tempFilePaths.push(res.obj[0])
            //     // this.imgUrl = this.tempFilePaths.join()
            //   },
            //   fail: () => {
            //     uni.showModal({
            //       content: '图片过大，请重新上传',
            //       icon: 'none',
            //       showCancel: false,
            //     })
            //   },
            // })
          }
        },
        fail: () => {
          // #ifdef MP
          uni.getSetting({
            success: (res) => {
              let authStatus = res.authSetting['scope.album']
              if (!authStatus) {
                uni.showModal({
                  title: '授权失败',
                  content: 'Hello uni-app需要从您的相册获取图片，请在设置界面打开相关权限',
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting()
                    }
                  },
                })
              }
            },
          })
          // #endif
        },
      })
    },
    // 预览图片
    previewImage: function (url) {
      let urlArr = []
      urlArr.push(url)
      uni.previewImage({
        current: url,
        urls: urlArr,
      })
    },
    // 历史消息
    async history() {
      this.loading = true
      if (this.myNewsList.length != 0) {
        // 'this.myNewsList.length', this.myNewsList.length)
        this.time = this.$moment(this.myNewsList[0].created)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          .replace('+00:00', '+0000')
      }
      try {
        const res = await this.$api.Im.history({
          agentName: this.agentName, // 系统代理
          username: this.$store.state.userInfo.customerId, // 用户唯一标识别
          conversationId: this.dialogueId, // 会话id
          time: this.time, // 时间  第一次:传空
          limit: this.limit, // 每页几个
        })
        if (res.success) {
          for (let i = 0; i < res.obj.length; i++) {
            this.$store.commit('HISTORY_MESSAGE', res.obj[i])
          }
          // 数据加载完毕==>返回的数据小于每一页的数量
          if (res.obj.length < this.limit) {
            this.rolling = false
            this.loading = false
            this.historyMessage = '暂无历史消息'
          } else {
            setTimeout(() => {
              this.loading = false
            }, 500)
            this.scrollDs()
          }
        } else {
          this.loading = false
          this.$util.toast('暂无历史消息')
        }
      } catch (e) {
        this.$handleError.handleApiRequestException(e)
      }
    },
    // 表情
    faceContent() {
      this.faceShow = !this.faceShow
      if (this.faceShow) {
        for (let i in appData) {
          this.faceList.push(appData[i].char)
        }
      } else {
        this.faceList = []
      }
      this.scrollTop = this.old.scrollTop
      if (!this.faceShow || !this.myNewsList.length) {
        this.bottomHeight = '0px'
      } else {
        this.bottomHeight = '260px'
      }
      this.$nextTick(() => {
        this.scrollTop = 99999
      })
      this.scrollTop++
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (let i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index]
          this.textMsg += this.getBrowString
          // 关闭表情列表
          this.faceShow = false
          this.bottomHeight = '40px'
          this.$nextTick(() => {
            this.scrollTop = 99999
          })
          this.scrollTop++
        }
      }
    },
    async scrollToBottom() {
      this.$nextTick(async () => {
        var container = document.querySelector('.im-list')
        var containers = this.$refs.test
        // #ifdef H5
        container.scrollTop = container.scrollHeight
        // #endif
        // #ifdef APP-PLUS
        containers.scrollTop = containers.$el.scrollHeight
        // #endif
        window.scrollTo({ top: containers.$el.scrollHeight })
        uni.pageScrollTo({
          duration: 0, //过渡时间必须为0，否则运行到手机会报错
          scrollTop: containers.$el.scrollHeight, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
        })
      })
      uni
        .createSelectorQuery()
        .select('.im-list')
        .boundingClientRect((data) => {
          //最外层盒子节点
          uni.pageScrollTo({
            duration: 0, //过渡时间必须为0，否则运行到手机会报错
            scrollTop: data.height + Math.abs(data.top), //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
          })
        })
        .exec()
    },
    // IM消息推送
    async sendGroup(msg) {
      console.log('M消息推送========',msg)
      // const res = await this.$api.Im.sendGroup({
      //   agentName: this.agentName, // 系统代理
      //   conversationId: this.dialogueId, // 会话id
      //   fromClient: this.fromClient, // 发送人
      //   message: JSON.stringify(msg), // 消息主体
      // })
      // if (res.success) {
      //   this.myNewsList = this.getChatData.get(this.dialogueId)
      //   this.textMsg = ''
      //   this.scrollToBottom()
      // } else {
      //   this.$util.toast(this.$t(res.msg))
      // }
    },
    scrollDs() {
      // var a = document.querySelector('#test')
      var a = this.$refs.test
      a.scrollTop = 540 //body
      a.scrollTop = 540 //html
    },
    // 发送文本内容
    async sendTextMsg() {
      if (this.textMsg.trim().length <= 0) {
        return
      }
      if (this.textMsg.trim().length > 200) {
        this.$util.toast('发送的消息不能超过200字')
        return
      }
      let myNews = {
        type: 0,
        // message: encodeURI(this.textMsg.replace(/\n/g, '\\n')),
        message: encodeURIComponent(this.textMsg),
      }
      console.log('myNews=====',myNews)
      this.sendGroup(myNews)
    },
    textareaFocus(e) {
      this.scrollTop = this.old.scrollTop
      if (!this.myNewsList.length) {
        this.bottomHeight = '40px'
      } else {
        this.bottomHeight = e.detail.height + 'px'
      }
      this.faceShow = false
      this.focusFlag = true
      this.$nextTick(() => {
        this.scrollTop = 99999
      })
      this.scrollTop++
    },
    keyboardHeightChanged(e) {
      if (!e.detail.height) {
        this.bottomHeight = '40px'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .uni-navbar__header-container {
  justify-content: center;
}

.instant-messaging {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - var(--window-top));
  margin: 0;
  padding: 0;

  ::v-deep .uni-navbar--border {
    border: none;

    .uni-navbar__header-btns {
      width: 50px;
      padding-right: 0;

      .iconfont {
        padding-right: 17px;
        color: #666;
      }

      .iconfanhui {
        padding-left: 6px;
        font-size: 18px;
      }
    }
  }

  .status-text {
    height: 35px;
    padding: 0 44px;
    font-size: 16px;
    line-height: 35px;
  }

  .contentBox {
    width: 100%;
    text-align: left;

    li {
      margin-bottom: 20px;
      padding: 4px 10px;
      list-style: none;

      text {
        padding: 5px;
        border-radius: 5px;
        background: #333;
      }
    }
  }

  .contFaceShow {
    // position: absolute;
    // bottom: 130px;
    // height: 375px !important;
  }

  .box {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    margin: auto;

    .entry-ipt {
      position: absolute;
      bottom: 0%;
      left: 0%;
      width: 74%;
      height: 100%;
      border: 1px solid #ececec;
    }

    .referBut {
      position: absolute;
      right: 2%;
      bottom: 0%;
      width: 10%;
      height: 100%;
      border-radius: 5px;
      background: #aaf;
      color: #333;
    }

    .faceBut {
      position: absolute;
      right: 13%;
      bottom: 0;
      width: 10%;
      height: 100%;
      border-radius: 5px;
      background: #aaf;
      color: #333;
    }
  }

  .boxFaceShow {
    position: fixed;
    bottom: 260px !important;
  }

  .browBox {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 260px;
    overflow: scroll;
    background: #666;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;

      li {
        width: 14%;
        padding-bottom: 9px;
        font-size: 26px;
        list-style: none;
        text-align: center;
      }
    }
  }

  .im-list {
    box-sizing: border-box;
    flex: 1;
    min-height: 100%;
    padding-top: 20px;
    padding-bottom: 50px;
    background-color: #fff;
  }

  // 自己发送的消息
  .keepleft {
    justify-content: flex-start;
  }

  .keepright {
    justify-content: flex-end;
  }

  .bgleft {
    background: #b4b4b4;
    word-wrap: break-word;
    word-break: break-word;
  }

  .bgright {
    background: #b4b4b4;
    word-wrap: break-word;
    word-break: break-word;
  }

  .images-box {
    width: 150px;
    height: 150px;
    margin-right: 5px;
  }

  ::v-deep uni-image {
    width: 100%;
    height: 100%;
  }

  .own {
    display: flex;
    margin-bottom: 20px;

    .opposite-left {
      width: 30px;
      height: 30px;
      margin: 0 5px 0 10px;
    }

    .own-center {
      display: flex;
      flex-flow: column wrap;
      align-items: flex-end;

      .own-hd {
        max-width: 246px;
        margin-right: 4px;
        padding: 15px 17px 14px 12px;
        border-radius: 2px;
        font-size: 16px;
        line-height: 21px;

        // word-wrap: break-word;
        // word-break: normal;
        .showcontents {
          display: inline-block;
          color: #333;

          // text-align: start;
          white-space: pre-wrap;
        }
      }

      .own-bd-right {
        margin: 10px 5px 0 0;
        color: #666;
        font-size: 14px;
        text-align: right;
      }

      .own-bd-left {
        margin: 10px 0 0 5px;
        color: #666;
        font-size: 14px;
        text-align: left;
      }
    }

    .centerupt {
      align-items: flex-start;
    }

    .own-right {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }

  // 底部 输入信息
  .footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: flex-end;
    justify-content: flex-start;
    width: 100%;
    height: 50px;

    // height: 50px;
    background-color: #f7f9ff;
    color: #333;
    line-height: 50px;

    // background: pink;
    .footer-left {
      display: flex;
      box-sizing: border-box;
      align-items: flex-end;
      justify-content: flex-end;
      width: 80%;
      height: 100%;
      padding-left: 15px;
      border-radius: 2px;
      background-color: #f7f9ff;

      .uni-textarea {
        width: 70%;
      }

      ::v-deep uni-textarea {
        width: 100%;
        height: 35px;
        font-size: 16px;
      }

      .entry-left {
        width: 100%;
        margin: 38px 0 37px 10px;
        font-size: 16px;
      }

      .entry-right {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        width: 35%;

        .entry-icon {
          margin-right: 15px;
          color: #999;
        }
      }
    }

    .footer-right {
      width: 20%;
      color: #3f81ff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
  }

  .entry {
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    border-top: 1px solid #ececec;

    .entry-box {
      display: flex;
      justify-content: flex-end;
      margin: 14px 0 8px;
      padding-right: 15px;

      .entry-icon {
        color: #666;
        font-size: 26px;
        cursor: pointer;
      }
    }

    .entry-bottom {
      padding: 0 15px 15px;

      .entry-textarea {
        width: 100%;
        height: 60px;
        overflow: hidden;
        border: none;
        outline: none;
        resize: none;
      }
    }
  }

  .entry-img {
    margin: 0 15px;
  }

  .tips {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20px 0;
    border-top: 1px solid #ececec;
    background: #fff;
    color: #666;
    font-size: 16px;
    line-height: 30px;
    text-align: center;

    .tips-text {
      margin-left: 5px;
      color: #c7485f;
    }
  }

  .im-loading {
    display: flex;
    justify-content: center;
    height: 30px;

    .loading {
      display: inline-block;
      width: 20px;
      height: 17px;
    }

    .loading-text {
      color: #999;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .system {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    margin: 0 32px 32px 20px;
    color: #999;
    font-size: 14px;

    .system-text {
      margin-top: 10px;
      padding: 5px 5px 5px 10px;
      border-radius: 2px;
      background: rgb(233 233 233 / 50%);
      color: #666;
      line-height: 22px;
    }
  }

  ::-webkit-scrollbar {
    width: 3px;
    height: 5px;
  }

  ::-webkit-scrollbar-track-piece {
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    border-radius: 6px;
    background-color: #999;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    border-radius: 6px;
    background-color: #999;
  }
}

// }
</style>
<style lang="scss" scoped>
uni-page-body {
  height: 100%;
}
</style>
