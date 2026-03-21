import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Chat',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/chat/:id',
          name: 'ChatMain',
          component: () => import('@/views/chat/index.vue'),
        },
        {
          path: '/settings',
          name: 'Settings',
          component: () => import('@/views/settings/index.vue'),
        },
      ],
    },
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

export default router
