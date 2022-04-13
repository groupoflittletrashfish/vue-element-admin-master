import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/yz-auth/login',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/yz-auth/logout',
    method: 'post'
  })
}
