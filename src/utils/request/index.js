/**
 * 项目内请求对象
 */

import getEnv from '@/config'
import createRequest from './request'

// 基础请求对象，请求结果被包装
export const baseRequest = createRequest({
  baseUrl: getEnv('BASE_API'),
  header: {
    'Content-type': 'application/x-www-form-urlencoded',
  },
})

// 基础请求对象，请求结果不被包装
export const baseRequestDPackErr = createRequest(
  {
    baseUrl: getEnv('BASE_API'),
    header: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
  },
  false
)

// Im 请求结果对象，请求结果被包装
export const imService = createRequest({
  baseUrl: getEnv('IM_API'),
  header: {
    'Content-type': 'application/x-www-form-urlencoded',
  },
})
