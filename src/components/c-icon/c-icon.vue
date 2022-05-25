<template>
  <!-- #ifdef APP-NVUE -->
  <text @click="onClick" class="c-icon" :style="iconStyle">{{ icons[name] }}</text>
  <!-- #endif -->

  <!-- #ifndef APP-NVUE -->
  <text @click="onClick" class="c-icon" :class="name" :style="iconStyle"></text>
  <!-- #endif -->
</template>

<script>
// #ifdef APP-NVUE
import icons from './icons'
import base64ttf from './base64ttf'
// #endif
import { addUnit } from '@/utils'

export default {
  name: 'CustomIcon',
  props: {
    size: {
      type: [Number, String],
      default: 'inherit',
    },
    width: {
      type: [Number, String],
      default: 'auto',
    },
    height: {
      type: [Number, String],
      default: 'auto',
    },
    color: {
      type: String,
      default: '#333333',
    },
    name: {
      type: String,
      required: true,
    },
    rpx: {
      type: Boolean,
      required: false,
      default: false,
    },
    bubble: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    iconStyle() {
      return {
        fontSize: this.size === 'inherit' ? 'inherit' : addUnit(this.size, this.rpx),
        width: addUnit(this.width, this.rpx),
        height: addUnit(this.height, this.rpx),
        color: this.color,
        'line-height': addUnit(this.height, this.rpx),
      }
    },
  },
  methods: {
    onClick(e) {
      this.$emit('click')
      if (!this.bubble && e) {
        e.stopPropagation()
      }
    },
  },
  // #ifdef APP-NVUE
  data() {
    return {
      icons: icons,
    }
  },
  beforeCreate() {
    /**
     * iconfont 需要用ttf转base64
     * 转换网址：https://www.giftofspeed.com/base64-encoder/
     */
    const dom = uni.requireNativePlugin('dom')
    dom.addRule('fontFace', {
      fontFamily: 'iconfont2',
      src: `url('data:font/truetype;charset=utf-8;base64,${base64ttf}')`,
    })
  },
  // #endif
}
</script>

<style scoped>
/* #ifndef APP-NVUE */
@import './iconfont.css'; /* Iconfont */

/* #endif */
.c-icon {
  font-family: iconfont2;
  text-align: center;
  text-decoration: none;
}
</style>
