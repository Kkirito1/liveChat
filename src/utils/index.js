/**
 * @name 引入依赖库
 */
import md5 from 'md5'

import { isNumber } from './core/validate'

// export * as WebUtil from './core/web'
// export * as ValidateUtil from './core/validate'
// export * from './core/uni-app'
export { md5 }

/**
 * 适配老版本的登录 MD5，这有用吗？？？？
 */
export function loginMd5(value) {
  return md5(`${value}hello, moto`)
}

/**
 * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Number} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function guid(len = 32, firstU = true, radix = null) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guid不能用作id或者class
  if (firstU) {
    uuid.shift()
    return 'u' + uuid.join('')
  } else {
    return uuid.join('')
  }
}

export function removeEmptyKey(obj = {}) {
  // 处理参数为undefined情况
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
export function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function equalsObj(oldData, newData) {
  // 类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true
  if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
    // 类型为对象并且元素个数相同

    // 遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key])) {
          // 对象中具有不相同属性 返回false
          return false
        }
      }
    }
  } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
    // 类型为数组并且数组长度相同

    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i])) {
        // 如果数组元素中具有不相同元素,返回false
        return false
      }
    }
  } else {
    // 其它类型,均返回false
    return false
  }
  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true
}

/**
 * @name 获取小数点后位数
 * @param {Number} number 需要获取的数
 * @returns {Number} 返回小数位数
 * @description 没有小数返回0
 */
export function getDecimalNumber(number) {
  const arr = String(number).split('.')
  return arr[1] ? arr[1].length : 0
}

/**
 * 去掉小数末尾多余的零
 * @param {Object} object
 */
export function cutZero(old) {
  //拷贝一份 返回去掉零的新串
  let newstr = old
  //循环变量 小数部分长度
  var leng = old.length - old.indexOf('.') - 1
  //判断是否有效数
  if (old.indexOf('.') > -1) {
    //循环小数部分
    for (let i = leng; i > 0; i--) {
      //如果newstr末尾有0
      if (newstr.lastIndexOf('0') > -1 && newstr.substr(newstr.length - 1, 1) === 0) {
        var k = newstr.lastIndexOf('0')
        //如果小数点后只有一个0 去掉小数点
        if (newstr.charAt(k - 1) === '.') {
          return newstr.substring(0, k - 1)
        } else {
          //否则 去掉一个0
          newstr = newstr.substring(0, k)
        }
      } else {
        //如果末尾没有0
        return newstr
      }
    }
  }
  return old
}

// 科学计数法转数字字符
export function toNonExponential(num) {
  num = Number(num)
  const type = typeof Number(num)
  if (type !== 'number') {
    throw new Error(`Illegal type of ${type}`)
  }
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

// 压缩图片
export function compress(image) {
  const img = image
  return new Promise((res) => {
    // console.log('res', res);
    // 压缩size
    plus.io.resolveLocalFileSystemURL(
      img,
      (entry) => {
        // console.log('entry', entry);
        // 通过entry对象操作图片
        entry.file((file) => {
          // console.log('file', file);
          // console.log('file.size', file.size, file.size > 504800);
          // 如果大于500kb进行压缩
          if (file.size > 504800) {
            // console.log('file.size', file.size, file.size > 504800);
            plus.zip.compressImage(
              {
                src: img,
                dst: img
                  .replace('.png', '2222.png')
                  .replace('.PNG', '2222.PNG')
                  .replace('.jpg', '2222.jpg')
                  .replace('.JPG', '2222.JPG'),
                width: '40%',
                height: '40%',
                quality: 10,
                overwrite: true,
              },
              (event) => {
                // console.log('event', event);
                // console.log('压缩之后的图片大小===>' + event.size);
                const newImg = img
                  .replace('.png', '2222.png')
                  .replace('.PNG', '2222.PNG')
                  .replace('.jpg', '2222.jpg')
                  .replace('.JPG', '2222.JPG')
                res(newImg)
              },
              () => {
                uni.showModal({
                  content: this.$t('app_picture_large'),
                  showCancel: false,
                })
              }
            )
          } else {
            res(img)
          }
        })
      },
      (e) => {
        uni.showModal({
          content: this.$t('app_picture_large'),
          showCancel: false,
        })
      }
    )
  })
}

// 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
export function addUnit(value = 'auto', rpx = false) {
  value = String(value)
  return isNumber(value) ? `${value}${rpx ? 'rpx' : 'px'}` : value
}

// 富文本转义
export function unescapeHTML(val) {
  return decodeURIComponent(val)
}
