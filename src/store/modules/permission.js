import { constantRoutes } from '@/router'
import { getMenus } from '@/api/common'
import Layout from '@/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

// const actions = {
//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       if (roles.includes('admin')) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // 调用后端的接口获取路由数据
      getMenus().then(response => {
        const { data } = response
        console.log(data)
        // 根据用户的身份信息（getInfo获取的），与访问菜单所需要的角色信息做比对，来过滤菜单，这个函数是框架本身自带的
        const router = filterAsyncRoutes(data, roles)
        console.log(router)
        // 这个函数是自定义的，名字和框架本身包含的方法名很像，注意区分，这个函数的作用是组装数据
        const asyncRouter = filterAsyncRouter(router)
        commit('SET_ROUTES', asyncRouter)
        resolve(asyncRouter)
      }).catch(error => {
        reject(error.Error)
      })
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

// 该函数是用来动态加载组件的
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}.vue`], resolve)
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理，因为Layout并不在views目录下
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
