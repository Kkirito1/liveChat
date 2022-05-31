import { toast } from './index'
import { i18n } from '@/lang'
// import getEnv from '@/config'

/**
 * @name Handle api request exception
 * @description when api request fail, you should using this in your catch block
 * @param { Error } e exception object
 * @returns void
 */
function handleApiRequestException(res) {
  console.warn('Capture request exception >>>', res)
  toast(res.msg)
}

/**
 * @name Handle WebSocket exception
 * @description when WebSocket exception, you should using this in your catch block
 * @param { Error } e exception object
 * @returns void
 */
function handleWebSocketException() {
  toast('内部服务器错误')
}

/**
 * @name Handle application exception
 * @description when Application exception, you should using this in your catch block
 * @param { Error } e exception object
 * @returns void
 */
function handleApplicationException(e) {
  // toast('运行错误')
  console.error(e)
  // if (getEnv('IS_ENABLE_DEBUG_ERROR_MODAL')) {
  //   uni.showModal({
  //     title: '发生错误！',
  //     content: e,
  //     showCancel: true,
  //     cancelText: '取消',
  //     confirmText: '确认',
  //   })
  // }
}

/**
 * @name Handle request fail
 * @description when the success form request result is not true, using this fun.
 */
function handleRequestFail(res) {
  console.warn('Capture request fail >>>', res)
  const resType = typeof res
  if (resType === 'string') {
    toast(i18n.t(res))
  } else {
    toast(i18n.t(res.msg))
  }
}

export {
  // ajax请求catch用这个，用的最多的也是这个
  handleApiRequestException,
  // 关于websocket可能连接出错用这个
  handleWebSocketException,
  // 程序可能出错误可以用这个
  handleApplicationException,
  // 请求返回结果的success为false可以用这个
  handleRequestFail,
}
