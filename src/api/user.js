import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/yz-auth/login',
    method: 'post',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/yz-auth/sysUser/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/yz-auth/logout',
    method: 'post'
  })
}

export function queryAllUserWithRole(data) {
  return request({
    url: '/yz-auth/sysUser/queryAllWithRole',
    method: 'get',
    params: data
  })
}

export function queryAllRoles(data) {
  return request({
    url: '/yz-auth/sysRole/queryAll',
    method: 'get',
    params: data
  })
}

export function updateUser(data) {
  return request({
    url: '/yz-auth/sysUser/updateUser',
    method: 'post',
    data
  })
}

export function queryMenuTree() {
  return request({
    url: '/yz-auth/sysMenu/queryMenuTree',
    method: 'get'
  })
}

export function updateMenu(data) {
  return request({
    url: '/yz-auth/sysMenu/updateMenu',
    method: 'post',
    data
  })
}

export function delMenu(data) {
  return request({
    url: '/yz-auth/sysMenu/delMenu',
    method: 'post',
    data
  })
}

export function delRole(data) {
  return request({
    url: '/yz-auth/sysRole/delRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/yz-auth/sysRole/updateRole',
    method: 'post',
    data
  })
}

export function queryRoleWithPermissions(data) {
  return request({
    url: '/yz-auth/sysRoleMenu/queryRoleWithPermissions',
    method: 'get',
    params: data
  })
}

export function uptRoleMenu(data) {
  return request({
    url: '/yz-auth/sysRoleMenu/uptRollMenu',
    method: 'post',
    data
  })
}

