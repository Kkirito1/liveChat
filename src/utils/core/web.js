// base64转blob
export function base64ToBlob(base64) {
  const parts = base64.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], {
    type: contentType,
  })
}

/**
 * web 文件下载
 */
export function downloadImg(file, options) {
  // 配置
  const config = Object.assign(
    {
      // 下载类型 base64 img url
      type: 'base64',
      // 文件名
      filename: 'file',
    },
    options
  )
  const { type, filename } = config
  if (type === 'base64') {
    const aLink = document.createElement('a')
    const blob = base64ToBlob(file)
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = filename
    aLink.href = URL.createObjectURL(blob)
    // aLink.dispatchEvent(evt);
    aLink.click()
  } else if (type === 'img') {
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    // 图片转base64地址
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.drawImage(file, 0, 0)
    // 如果是PNG图片，则canvas.toDataURL('image/png')
    eleLink.href = canvas.toDataURL('image/jpeg')
    // 触发点击
    document.body.appendChild(eleLink)
    eleLink.click()
    // 然后移除
    document.body.removeChild(eleLink)
  } else if (type === 'url') {
    const aLink = document.createElement('a')
    // const blob = this.$util.base64ToBlob(this.qrcodeSrc) //new Blob([content]);
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = filename
    aLink.href = file
    aLink.target = '_blank'
    // aLink.dispatchEvent(evt);
    aLink.click()
  }
}
