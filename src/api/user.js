import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/yz-auth-center/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': 'Basic bm9uYW1lOjEyMzQ1Ng=='
    }
  })
}

export function getInfo() {
  return request({
    url: '/yz-pm/sysUser/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/yz-auth-center/logout',
    method: 'post'
  })
}

export function queryAllUserWithRole(data) {
  return request({
    url: '/yz-pm/sysUser/queryAllWithRole',
    method: 'get',
    params: data
  })
}

export function queryAllRoles(data) {
  return request({
    url: '/yz-pm/sysRole/queryAll',
    method: 'get',
    params: data
  })
}

export function updateUser(data) {
  return request({
    url: '/yz-pm/sysUser/updateUser',
    method: 'post',
    data
  })
}

export function queryMenuTree() {
  return request({
    url: '/yz-pm/sysMenu/queryMenuTree',
    method: 'get'
  })
}

export function updateMenu(data) {
  return request({
    url: '/yz-pm/sysMenu/updateMenu',
    method: 'post',
    data
  })
}

export function delMenu(data) {
  return request({
    url: '/yz-pm/sysMenu/delMenu',
    method: 'post',
    data
  })
}

export function delRole(data) {
  return request({
    url: '/yz-pm/sysRole/delRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/yz-pm/sysRole/updateRole',
    method: 'post',
    data
  })
}

export function queryRoleWithPermissions(data) {
  return request({
    url: '/yz-pm/sysRoleMenu/queryRoleWithPermissions',
    method: 'get',
    params: data
  })
}

export function uptRoleMenu(data) {
  return request({
    url: '/yz-pm/sysRoleMenu/uptRollMenu',
    method: 'post',
    data
  })
}

export function deluser(data) {
  return request({
    url: '/yz-pm/sysUser/delUser',
    method: 'post',
    params: data
  })
}

export function refreshToken(data) {
  return request({
    url: '/yz-auth-center/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization2': 'Basic bm9uYW1lOjEyMzQ1Ng=='
    }
  })
}

