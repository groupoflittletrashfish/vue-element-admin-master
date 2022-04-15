// 由于vue-element-admih 已经封装好了axios,即在request.js中，所以我们引入
import request from '@/utils/request'
// getCaptcha就是函数名称，当然也是可以传递参数的，此处没有而已。然后就是一些基本属性，注意由于是验证码，所以指定了arraybuffer的返回类型
// 完整的属性可以查看 https://blog.csdn.net/weixin_42161050/article/details/121475647
export function getCaptcha() {
  return request({
    url: '/yz-auth/captcha/captchaCode',
    method: 'post',
    responseType: 'arraybuffer'
  })
}

export function getMenus() {
  return request({
    url: '/yz-admin/sysMenu/getSidebar',
    method: 'get'
  })
}
