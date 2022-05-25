export default {
  /**
   * @name 获取小数点后位数
   * @param {Number} number 需要获取的数
   * @returns {Number} 返回小数位数
   * @description 没有小数返回0
   */
  getDecimalNumber(number) {
    const arr = String(number).split('.')
    return arr[1] ? arr[1].length : 0
  },
  /**
   * 去掉小数末尾多余的零
   * @param {Object} object
   */
  cutZero(old) {
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
  },
  // 科学计数法转数字字符
  toNonExponential(num) {
    num = Number(num)
    const type = typeof Number(num)
    if (type !== 'number') {
      throw new Error(`Illegal type of ${type}`)
    }
    const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
  },
  // 压缩图片
  compress(image) {
    console.log('image', image)
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
          console.log('e', e)
          uni.showModal({
            content: this.$t('app_picture_large'),
            showCancel: false,
          })
        }
      )
    })
  },
}
