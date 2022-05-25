/**
 * 请求模块
 */

import getEnv from '@/config'
import { md5, guid, removeEmptyKey, router } from '@/utils'
import { rsaEncrypted } from '@/utils/encrypt'
import store from '@/store'
import Request from './core/request-class'
import { i18n, getApiLang } from '@/lang'

/**
 * 创建加密参数
 * @param {Array} signStrArr 需要加密的参数打散数组
 */
export function createApiSign(signStrArr) {
  // 时间差值
  const { TDOA = 0 } = store.state.appSessionStatus.appConfig
  const uuidStr = guid()
  const timestampStr = String(new Date().getTime() - TDOA)

  signStrArr.push(uuidStr)
  signStrArr.push(timestampStr)
  const sign = md5(signStrArr.sort().toString())
  const nonce = rsaEncrypted(getEnv('API_SIGN_RSA_PUBLIC_KEY'), `${uuidStr},${timestampStr}`)
  return {
    sign,
    nonce,
  }
}

export function createPureSign() {
  const { TDOA = 0 } = store.state.appSessionStatus.appConfig

  const uuidStr = guid()
  const timestampStr = String(new Date().getTime() - TDOA)
  const keys = [uuidStr, timestampStr]

  const Sign = md5(keys.sort().toString())
  const Nonce = rsaEncrypted(getEnv('API_SIGN_RSA_PUBLIC_KEY'), `${uuidStr},${timestampStr}`)

  return {
    Sign,
    Nonce,
  }
}
let isLoading = false

/**
 * 创建请求函数对象
 * @param { Object } options 配置参数
 * @param { Boolean } packErr 是否包装错误，
 * 包装了错误，请求时不会 reject，只需要判断请求是否成功，会包装和后台返回类似的数据结构，便于前端统一处理请求结果，适合后台返回的数据结构统一
 *  例如如下格式，可自行修改数据格式 {
 *  success: false,
 *  msg: '操作成功',
 *  data: {},
 * }
 * 不包装错误，需要每个请求加上 catch 块进行错误处理，适合后台返回的数据结构不统一
 * @returns { Function } 请求函数对象
 */
export default function createRequest(options, packErr = true) {
  // 实例对象
  const http = new Request(options)

  // 请求拦截器
  http.setReqInterceptor((config) => {
    const { method, params, data } = config
    const { token } = store.state

    // token
    if (token) {
      config.header['token'] = token
    }

    // 加密参数
    let keys = []

    // 处理get
    if (['get', 'GET'].includes(method)) {
      config.data = {
        ...params,
        _t: Date.parse(new Date()) / 1000,
      }
      if (!config.data['langCode']) {
        config.data['langCode'] = getApiLang()
      }
      // 删除 params
      delete config.params

      // loading 配置
      const { isShowLoading = true } = config.data
      if (isShowLoading) {
        !isLoading && (isLoading = true)
        uni.showLoading({
          title: i18n.t('app_loading'),
          mask: true,
        })
      }
      // 删除data里isShowLoading
      delete config.data.isShowLoading

      // 处理参数为 undefined 情况
      removeEmptyKey(config.data)
      // 合并参数
      keys = keys.concat(Object.keys(config.data || {}))
      keys = keys.concat(Object.values(config.data || {}))
    }

    // 处理post
    if (['post', 'POST'].includes(method)) {
      if (data) {
        if (!config.data['langCode']) {
          config.data['langCode'] = getApiLang()
        }
      } else {
        config.data = {
          langCode: getApiLang(),
        }
      }

      // loading 配置
      const { isShowLoading = true } = config.data
      if (isShowLoading) {
        !isLoading && (isLoading = true)
        uni.showLoading({
          title: i18n.t('app_loading'),
          mask: true,
        })
      }
      // 删除data里isShowLoading
      delete config.data.isShowLoading

      // 处理参数为undefined情况
      removeEmptyKey(config.data)
      // 合并post参数
      keys = keys.concat(Object.keys(config.data || {}))
      keys = keys.concat(Object.values(config.data || {}))
    }

    const signStrArr = []
    for (const item of keys) {
      signStrArr.push(String(item))
    }

    const { nonce, sign } = createApiSign(signStrArr)

    config.header['Nonce'] = nonce
    config.header['Sign'] = sign
    return config
  })

  // 响应拦截器
  http.setResInterceptor(
    // 请求成功 http code === 200
    (res) => {
      isLoading && uni.hideLoading()
      return res.data
    },

    // 请求失败 http code !== 200
    (res) => {
      isLoading && uni.hideLoading()
      return res
    }
  )

  // Definition get new token api
  const getNewToken = ({ refreshToken }) =>
    http.request({
      url: '/user/getNewToken',
      method: 'post',
      data: {
        refreshToken,
        isShowLoading: false,
      },
    })

  /**
   * @name 导出请求方法函数,项目中所有请求应该走此方法，不存在例外
   * @desc 2021-02-06 10:59:06 增加全局错误捕获
   */
  return async function request(config) {
    try {
      if (config.method.toUpperCase() === 'UPLOAD') {
        // 文件上传
        const res = await http.upload(config)
        return Promise.resolve(res)
      } else {
        // 普通请求
        const res = await http.request(config)
        // 401处理
        if (res.code === '401') {
          // Get new token
          const newRes = await getNewToken({
            refreshToken: store.state.refreshToken,
          })

          if (newRes.success) {
            // Update vuex token
            store.commit('UPDATE_TOKEN', {
              token: newRes.obj.token,
            })
            // Update vuex refresh token
            store.commit('UPDATE_REFRESH_TOKEN', {
              refreshToken: newRes.obj.refreshToken,
            })
            // Re request
            return await http.request(config)
          } else {
            // 退出登录
            store.commit('USER_LOGIN_OUT')
            router({
              type: 'switchTab',
              url: '/pages/user/user',
            })
            setTimeout(() => {
              // 去登录界面
              router({
                url: '/pages/user/auth/login/login',
              })
            }, 100)

            /**
             * @name 封装的错误对象
             */
            return Promise.resolve({
              success: false,
              msg: 'notice_relogin',
              obj: newRes,
              code: 401,
            })
          }
        } else {
          return Promise.resolve(res)
        }
      }
    } catch (res) {
      let packRes = null
      if (res instanceof Error) {
        console.error('捕捉到前端代码错误>>>', res)
        packRes = {
          success: false,
          msg: 'notice_system_error',
        }
      } else {
        console.error('捕捉到后端服务错误>>>', res)
        packRes = {
          success: false,
          // 网络错误
          msg: 'tips_network_error',
        }
      }
      /**
       * @name 封装的错误对象
       */
      return packErr ? Promise.resolve(packRes) : Promise.reject(packRes)
    }
  }
}
