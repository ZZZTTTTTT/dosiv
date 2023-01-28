import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/',
    // 如需还原，请重定向到/real/index
    redirect: '/real/index',
    // redirect: '/bigscreen',
  },
  {
    path: '/real',
    component: Layout,
    children: [
      {
        // path: 'index/:nodeId?',
        path: 'index',
        name: 'Real',
        component: () => import('@/views/real/index'),
        meta: { title: '实时状态', icon: 'dashboard' },
      },
    ],
  },
  {
    path: '/bigscreenentry',
    component: () => import('@/views/bigscreen/bigscreenentry'),
    meta: { title: '大屏展示', icon: 'dashboard', keepAlive: false },
  },
  {
    path: '/bigscreen/:nodeId?',
    component: () => import('@/views/bigscreen/bigscreen'),
    hide: true,
  },

  // {
  //   path: '/workbench',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Workbench',
  //       component: () => import('@/views/workbench/index'),
  //       meta: { title: '工作台', icon: 'form' },
  //     },
  //   ],
  // },
  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true },
]

export const asyncRoutes = [
  {
    path: '/workbench',
    component: Layout,
    redirect: '/workbench/index',
    alwaysShow: false,
    name: 'Workbench',
    meta: {
      title: '工作台',
      icon: 'lock',
      roles: ['workbench'],
    },
    children: [
      {
        path: 'index',
        name: 'WorkbenchIndex',
        component: () => import('@/views/workbench/index'),
        meta: { title: '工作台', icon: 'clipboard', role: ['workbench'] },
      },
    ],
  },
  {
    path: '/diagnose',
    component: Layout,
    redirect: '/diagnose',
    alwaysShow: false,
    name: 'Diagnose',
    meta: {
      title: '诊断工具',
      icon: 'chart',
      roles: ['diagnose'],
    },
    children: [
      {
        path: 'index',
        name: 'DiagnoseIndex',
        component: () => import('@/views/diagnose'),
        meta: { title: '诊断工具', icon: 'chart', role: ['diagnose'] },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
