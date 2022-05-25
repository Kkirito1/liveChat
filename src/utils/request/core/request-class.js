export default class Request {
  constructor(config) {
    this.config = Object.assign(
      {
        header: {},
        baseUrl: '',
        // #ifdef APP-PLUS
        sslVerify: false,
        // #endif
      },
      config
    )
  }

  setReqInterceptor = (cb) => (this.reqInterceptor = cb)
  setResInterceptor = (sucCb, failCb) => {
    this.resInterceptor = sucCb
    this.resFailInterceptor = failCb
  }

  /**
   * 设置自定义 httpCode 判断器，有时候 http code 为 401 也需要进入请求成功拦截器需要用到该方法。
   * @param { Function } cb
   * @return { null }
   */
  setValidateStatus = (cb) => {
    cb && (this.validateStatus = cb)
  }

  validateStatus(statusCode) {
    return statusCode === 200
  }

  reqInterceptor = (config) => config
  resInterceptor = (response) => response
  resFailInterceptor = (response) => response

  async request(options = {}) {
    return new Promise((resolve, reject) => {
      options.baseUrl = this.config.baseUrl
      options.header = Object.assign(options.header || {}, this.config.header)
      const handleReq = this.reqInterceptor(options)
      const _config = {
        url: `${handleReq.baseUrl}${handleReq.url}`,
        data: handleReq.data,
        header: handleReq.header,
        method: handleReq.method.toUpperCase(),
        // #ifdef APP-PLUS
        sslVerify: handleReq.sslVerify,
        // #endif
        complete: (response) => {
          // 验证statusCode是否成功
          if (this.validateStatus(response.statusCode)) {
            resolve(this.resInterceptor(response))
          } else {
            reject(this.resFailInterceptor(response))
          }
        },
      }
      uni.request(_config)
    })
  }

  /**
   * 上传文件
   */
  async upload(options) {
    return new Promise((resolve, reject) => {
      options.baseUrl = this.config.baseUrl
      options.header = Object.assign(options.header || {}, this.config.header)

      delete options.header['content-type']
      delete options.header['Content-Type']
      delete options.header['Content-type']
      delete options.method

      const handleReq = this.reqInterceptor(options)

      const _config = {
        url: handleReq.baseUrl + handleReq.url,
        // #ifdef MP-ALIPAY
        fileType: handleReq.fileType,
        // #endif
        filePath: handleReq.filePath,
        name: handleReq.name,
        header: handleReq.header,
        formData: handleReq.formData,
        success: (response) => {
          if (typeof response.data === 'string') {
            response.data = JSON.parse(response.data)
          }
          resolve(this.resInterceptor(response))
        },
        fail: (e) => {
          reject(this.resFailInterceptor(e))
        },
      }
      // 请求
      uni.uploadFile(_config)
    })
  }
}
