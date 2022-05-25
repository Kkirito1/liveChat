import { isUrl } from './validate'
import { i18n } from '@/lang'

/**
 * 检查相机权限
 * @returns
 */

function _checkCameraPermission(navigatorName, cb) {
  const CAMERA = plus.navigator.checkPermission(navigatorName)
  if (CAMERA === 'undetermined') {
    switch (navigatorName) {
      case 'CAMERA':
        uni.scanCode({})
        break
      case 'GALLERY':
        uni.saveImageToPhotosAlbum({
          filePath: '',
        })
        break
      default:
        break
    }
  } else if (CAMERA === 'denied') {
    let langKey = null
    switch (navigatorName) {
      case 'CAMERA':
        langKey = 'Please_open_the_camera_permission'
        break
      case 'GALLERY':
        langKey = 'Please_open_album_permissions'
        break
      default:
        langKey = null
        break
    }
    toast(i18n.t(langKey))
    setTimeout(() => {
      plus.runtime.openURL('app-settings://')
    }, 1000)
  } else {
    cb()
  }
}

/**
 * uni-app 摄像头权限封装 封装
 * @returns
 */
export function scanCode(options) {
  // #ifdef APP-PLUS
  _checkCameraPermission('CAMERA', () => {
    uni.scanCode(options)
  })
  // #endif
}
/**
 * uni-app 相册权限封装 封装
 * @returns
 */
export function saveImageToPhotosAlbum(options) {
  // #ifdef APP-PLUS
  if (plus.os.name === 'Android') {
    return uni.saveImageToPhotosAlbum(options)
  }
  _checkCameraPermission('GALLERY', () => {
    uni.saveImageToPhotosAlbum(options)
  })
  // #endif
}

/**
 *
 * @returns
 */

/**
 * @name 获取主题模式
 */
export function getUIStyle() {
  return plus.navigator.getUIStyle()
}

/**
 * @param { String } msg 需要显示的消息
 * @param { Object } options 配置,同uni-app官网
 */
export function toast(msg, options) {
  uni.showToast(
    Object.assign(
      {
        icon: 'none',
        title: msg,
        duration: 2000,
      },
      options
    )
  )
}

// 是否正在跳转
let _isRouting = false

const navigateAnimationTypes = [
  undefined,
  'auto',
  'none',
  'slide-in-right',
  'slide-in-left',
  'slide-in-top',
  'slide-in-bottom',
  'fade-in',
  'zoom-out',
  'zoom-fade-out',
  'pop-in',
]
const navigateBackAnimationTypes = [
  undefined,
  'auto',
  'none',
  'slide-out-right',
  'slide-out-left',
  'slide-out-top',
  'slide-out-bottom',
  'fade-out',
  'zoom-in',
  'zoom-fade-in',
  'pop-out',
]
/**
 * uni-app 路由封装
 * @param { Object } options - 参数配置
 * @param { string } options.url - uni-app 页面地址
 * @param { string } [options.type='navigateTo'] - 跳转类型
 * @param { string } [options.delta=1] - 返回的页面数，如果 delta 大于现有页面数，则返回到首页
 * @param { string } [options.animationType='pop-in'] - 窗口显示的动画效果
 * @param { string } [options.animationDuration=300] - 窗口动画持续时间，单位为 ms
 * @param { function } [options.fail=cb] - 失败回调
 * @param { function } [options.complete=cb] - 完成回调
 * @returns { null }
 */
export function router(options = {}) {
  if (_isRouting) {
    return
  }
  // 正在跳转
  _isRouting = true
  const _config = {
    // 页面路径
    url: '',
    // 跳转类型
    type: 'navigateTo',
    // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
    delta: 1,
    // 窗口显示的动画效果
    animationType: 'pop-in',
    // 窗口动画持续时间，单位为 ms
    animationDuration: 300,
    // 接口调用成功的回调函数
    // success() {},
    // 接口调用失败的回调函数
    // fail(e) {
    //   console.warn(e)
    // },
    // 接口调用结束的回调函数（调用成功、失败都会执行）
    // complete() {
    //   _isRouting = false
    // },
  }
  // 失败
  const failFun = (e) => {
    console.warn(e)
  }
  // 完成
  const completeFun = () => {
    _isRouting = false
  }

  // 合并参数
  Object.assign(_config, options)
  let { animationType } = _config

  const { url, animationDuration, success, fail, complete, delta, type } = _config

  switch (type) {
    case 'navigateTo':
      if (navigateAnimationTypes.includes(animationType)) {
        animationType = 'pop-in'
      }
      // 保留当前页面，跳转到应用内的某个页面
      uni.navigateTo({
        url,
        animationType,
        animationDuration,
        success(result) {
          success && success(result)
        },
        fail(e) {
          failFun(e)
          fail && fail(e)
        },
        complete(result) {
          completeFun()
          complete && complete(result)
        },
      })
      break

    case 'redirectTo':
      // 关闭当前页面，跳转到应用内的某个页面
      uni.redirectTo({
        url,
        success(result) {
          success && success(result)
        },
        fail(e) {
          failFun(e)
          fail && fail(e)
        },
        complete(result) {
          completeFun()
          complete && complete(result)
        },
      })
      break

    case 'reLaunch':
      // 关闭所有页面，打开到应用内的某个页面
      uni.reLaunch({
        url,
        success(result) {
          success && success(result)
        },
        fail(e) {
          failFun(e)
          fail && fail(e)
        },
        complete(result) {
          completeFun()
          complete && complete(result)
        },
      })
      break

    case 'switchTab':
      // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      uni.switchTab({
        url,
        success(result) {
          success && success(result)
        },
        fail(e) {
          failFun(e)
          fail && fail(e)
        },
        complete(result) {
          completeFun()
          complete && complete(result)
        },
      })
      break

    case 'navigateBack':
      // 关闭当前页面，返回上一页面或多级页面
      if (!navigateBackAnimationTypes.includes('animationType')) {
        animationType = 'pop-out'
      }
      uni.navigateBack({
        delta,
        animationType,
        animationDuration,
        success(result) {
          success && success(result)
        },
        fail(e) {
          failFun(e)
          fail && fail(e)
        },
        complete(result) {
          completeFun()
          complete && complete(result)
        },
      })
      break

    default:
      break
  }
}

/**
 * uni-app 复制文字方法
 * @param { string } value - 需要复制的内容
 * @param { Object } [options] - 参数配置
 * @param { string } [options.msg=''] - 复制完成提示文字
 * @returns { null }
 */
export function copy(value, options) {
  const config = Object.assign(
    {
      msg: '',
    },
    options
  )
  const { msg } = config
  // #ifndef H5
  uni.setClipboardData({
    data: String(value),
    complete() {
      uni.hideToast()
      if (msg) {
        toast(msg)
      }
    },
  })
  // #endif

  /**
   * H5 实现
   */
  // #ifdef H5
  const s = document.createElement('input')
  s.value = value
  document.body.appendChild(s)
  s.select()

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    s.contentEditable = 'true'
    s.readOnly = false
    const range = document.createRange()
    range.selectNodeContents(s)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    s.setSelectionRange(0, 999999)
  }

  try {
    document.execCommand('copy')
    // console.warn('Copied Success!')
    if (msg) {
      toast(msg)
    }
  } catch (err) {
    console.error('Copy error!', err)
  }
  s.remove()
  // #endif
}

/**
 * uni-app 打开链接
 * @param { string } url - 要跳转的地址
 * @param { Object } [options] - 参数配置
 * @param { boolean } [options.h5Inside=false] - H5 是否在当前窗口打开链接
 * @param { boolean } [options.appInside=true] - App 是否使用内部的浏览器打开链接
 */
export function openUrl(url, options) {
  const encodeUrl = encodeURI(decodeURIComponent(url))
  if (!isUrl(encodeUrl)) {
    return
  }
  const config = Object.assign(
    {
      h5Inside: false,
      appInside: true,
    },
    options
  )
  const { h5Inside, appInside } = config
  // #ifdef APP-PLUS
  if (appInside) {
    plus.runtime.openWeb(encodeUrl)
  } else {
    plus.runtime.openURL(encodeUrl)
  }
  // #endif

  // #ifdef H5
  if (h5Inside) {
    window.open(encodeUrl)
  } else {
    window.open(encodeUrl, 'target', '')
  }
  // #endif
}
