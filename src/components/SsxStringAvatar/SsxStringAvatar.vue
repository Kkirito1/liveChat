<template>
  <view class="ssx-string-avatar" :style="styleObject">
    {{ strAvatar }}
  </view>
</template>

<script>
export default {
  name: 'SsxStringAvatar',
  props: {
    // 中间文字
    text: {
      type: String,
      default: '',
    },
    // 字体颜色
    color: {
      type: String,
      default: '#fff',
    },
    // 字体大小
    fontSize: {
      type: String,
      default: '14px',
    },
    // 尺寸
    size: {
      type: String,
      default: '20.5px',
    },
    // 圆角
    round: {
      type: [Boolean, String],
      default: '50%',
    },
    // 背景颜色
    backgroundColor: {
      type: String,
      default: '#3f81ff',
    },
    // 随机背景颜色
    randomBg: {
      type: Boolean,
      default: false,
    },
    // 自适应大小，需要父级盒子有固定大小
    autoSize: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      bgColorArr: ['#00A0E9', '#4A5FE2', '#EC6941', '#977E60', '#E1D405', '#47AF09'],
    }
  },
  computed: {
    // 显示第一个字符
    strAvatar() {
      if (this.text) {
        return this.text.substr(0, 1)
      } else {
        return ''
      }
    },
    // 最终size
    endSize() {
      if (this.autoSize === true || this.autoSize === 'true') {
        return '100%'
      } else {
        return this.size
      }
    },
    // round
    endRound() {
      const patt = new RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/)
      if (patt.test(this.round)) {
        return this.round
      } else {
        if (this.round === 'false' || this.round === false) {
          return '0'
        } else {
          return '50%'
        }
      }
    },
    styleObject() {
      return {
        color: this.color,
        fontSize: this.fontSize,
        width: this.endSize,
        height: this.endSize,
        backgroundColor: this.randomBg ? this.bgColorArr[Math.floor(Math.random() * 6)] : this.backgroundColor,
        borderRadius: this.endRound,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ssx-string-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
