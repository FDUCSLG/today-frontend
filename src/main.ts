import { createApp } from 'vue';
import {
  message,
  Button,
  Modal,
  Drawer,
  Badge,
  Dropdown,
  Popover,
  Slider,
} from 'ant-design-vue';
import { Message } from 'ant-design-vue/types/message.d';
import {
  FIcon, FInput, FSelect, FTabs,
} from '@/components/common';
import axios from 'axios';

import App from './App.vue';
import './registerServiceWorker';
// TODO: 有空测试下不同引入方式的 bundle size
import router from './router';
import store from './store';

const app = createApp(App);

app.use(store).use(router);

// AntD 组件
app
  .use(Button)
  .use(Modal)
  .use(Drawer)
  .use(Badge)
  .use(Dropdown)
  .use(Popover)
  .use(Slider);
app.config.globalProperties.$message = message;
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: Message;
  }
}

// 自定义全局组件
app
  .component('FIcon', FIcon)
  .component('FInput', FInput)
  .component('FSelect', FSelect)
  .component('FTabs', FTabs);

// axios 拦截器
axios.interceptors.response.use((resp) => resp, (err) => {
  if (err.response.status === 401 && store.getters.userLoggedIn) {
    // 处理登录态失效
    message.error('登录已失效，请重新登录');
    store.commit('logout');
    router.push('/login');
  }
  return Promise.reject(err);
});

app.mount('#app');
