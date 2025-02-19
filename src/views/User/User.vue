<template>
  <div class="w-full h-full overflow-y-auto content-box max-w-14xl">
    <div class="flex-shrink-0 profile-card">
      <div
        v-if="isCurrentUser()"
        class="btn-section"
      >
        <router-link
          class="control-btn"
          to="/about"
          title="关于我们"
        >
          <f-badge
            :visible="isAboutBadgeVisible"
            offset-x="0.5"
            offset-y="0.5"
          >
            <f-icon
              class="text-gray-500"
              name="question-circle"
            />
          </f-badge>
        </router-link>
        <router-link
          class="control-btn"
          to="/user/edit"
          title="编辑资料"
        >
          <f-icon
            class="text-gray-500"
            name="pencil-square"
          />
        </router-link>
        <div
          class="control-btn"
          title="退出登录"
          @click="logout"
        >
          <f-icon
            class="text-gray-500"
            name="door-open"
          />
        </div>
      </div>
      <div
        v-else
        class="blank-box"
      />
      <div class="info-box">
        <img
          class="flex-shrink-0 avatar border-2 border-primary"
          :src="processAvatar(userProfile.avatar)"
          alt="avatar"
        >
        <div class="info-section">
          <div>
            <span class="user-name text-gray-600">
              {{ userProfile.nickname || userProfile.name }}
            </span>
            <!-- TODO: 实现关注功能 -->
            <span
              v-if="!isCurrentUser()"
              class="follow-btn bg-primary"
            >
              <span class="text-gray-600"> ＋&nbsp;关注 </span>
            </span>
          </div>
          <span class="bio text-gray-500">
            {{ userProfile.bio || '' }}
          </span>
        </div>
      </div>
      <!-- FIXME: 实现用户的关注、粉丝、被收藏数统计功能后按照实现的部分显示 -->
      <div
        v-if="false"
        class="follow-box"
      >
        <div class="follow-section">
          <span class="follow-number text-gray-600">
            {{ userProfile.watchers || 0 }}
          </span>
          <span class="follow-text text-gray-500"> 关注 </span>
        </div>
        <div class="follow-section">
          <span class="follow-number text-gray-600">
            {{ userProfile.watchees || 0 }}
          </span>
          <span class="follow-text text-gray-500"> 粉丝 </span>
        </div>
        <div class="follow-section">
          <span class="follow-number text-gray-600">
            {{ userProfile.fans || 0 }}
          </span>
          <span class="follow-text text-gray-500"> 被收藏数 </span>
        </div>
      </div>
    </div>

    <div class="flex-auto h-0 bg-white rounded-lg shadow-md">
      <f-tabs
        v-model="activeTab"
        class="w-full h-full"
      >
        <f-tab-pane tab="点评">
          <rating-list :active="activeTab === '点评'" />
        </f-tab-pane>
        <!-- FIXME: 下方功能实现后删去 v-if="false" -->
        <f-tab-pane
          v-if="false"
          tab="回复"
        >
          <comment-list :active="activeTab === '回复'" />
        </f-tab-pane>
        <f-tab-pane tab="课程">
          <lesson-list :active="activeTab === '课程'" />
        </f-tab-pane>
        <!-- FIXME: 下方功能实现后删去 v-if="false" -->
        <f-tab-pane
          v-if="false"
          tab="收藏"
        >
          <common-list
            :active="activeTab === '收藏'"
            type="收藏"
          />
        </f-tab-pane>
        <!-- FIXME: 下方功能实现后删去 v-if="false" -->
        <f-tab-pane
          v-if="isCurrentUser() && false"
          tab="关注"
        >
          <common-list
            :active="activeTab === '关注'"
            type="关注"
          />
        </f-tab-pane>
        <!-- FIXME: 下方功能实现后删去 v-if="false" -->
        <f-tab-pane
          v-if="isCurrentUser() && false"
          tab="足迹"
        >
          <common-list
            :active="activeTab === '足迹'"
            type="足迹"
          />
        </f-tab-pane>
      </f-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, provide, ref,
} from 'vue';
import { useStore } from 'vuex';
import { userClient } from '@/apis';
import { useProcessAvatar } from '@/composables';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {
  RatingList, CommentList, LessonList, CommonList,
} from './components';
import { CommonTabType } from './types';

type TabType = '点评' | '回复' | '课程' | CommonTabType;
interface UserProfile {
  avatar: string;
  bio: string;
  name: string;
  nickname: string;
  fans: number;
  watchers: number;
  watchees: number;
}

export default defineComponent({
  components: {
    RatingList,
    CommentList,
    LessonList,
    CommonList,
  },
  props: {
    // 访问的用户 ID
    userId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const currentUser = computed(() => store.state.user);
    const userLoggedIn = computed(() => store.getters.userLoggedIn);
    const isCurrentUser = () =>
      userLoggedIn.value && (props.userId === currentUser.value.id || props.userId === '');
    const setUserProfile = (profile: UserProfile) => store.commit('setUserProfile', profile);

    const logout = () => {
      if (userLoggedIn.value) {
        store.commit('logout');
        router.replace({ name: 'Timetable' });
      } else {
        store.commit('logout');
        router.replace({ name: 'Login', query: { redirect: '/user' } });
      }
    };

    const userProfile = ref<UserProfile>({
      avatar: '',
      bio: '',
      name: '',
      nickname: '',
      fans: 0,
      watchers: 0,
      watchees: 0,
    });

    // 读取用户信息
    if (isCurrentUser()) {
      userProfile.value = {
        avatar: currentUser.value.avatar,
        bio: currentUser.value.bio,
        name: currentUser.value.name,
        nickname: currentUser.value.nickname,
        fans: currentUser.value.fans,
        watchers: currentUser.value.watchers,
        watchees: currentUser.value.watchees,
      };
    }
    userClient
      .getUserInfo({ userId: props.userId || currentUser.value.id })
      .then((resp) => {
        userProfile.value = resp;
        if (isCurrentUser()) {
          setUserProfile(resp);
        }
      })
      .catch(() => {
        // 返回到上一页面
        router.go(-1);
      });

    provide<string>('userId', props.userId || currentUser.value.id);

    const { processAvatar } = useProcessAvatar();

    const activeTab = ref<TabType>('点评');

    // 判断是否显示 About 入口小红点的逻辑
    /** 是否显示 About 入口小红点 */
    const isAboutBadgeVisible = ref(false);

    /** 最近一次看过的更新日志日期 */
    const lastSawChangeLogDate = computed(() => store.state.lastSawChangeLogDate);

    axios.get<{ date: string }[]>('changeLog.json').then(({ data }) => {
      /** 最新的更新日志日期 */
      const latestDate = data.map((d) => d.date).sort((a, b) => (a < b ? 1 : -1))[0];
      if (latestDate !== lastSawChangeLogDate.value) {
        isAboutBadgeVisible.value = true;
      }
    });

    return {
      processAvatar,
      userProfile,
      activeTab,
      isCurrentUser,
      logout,
      isAboutBadgeVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
.content-box {
  display: flex;
  background-color: #e3f1f3;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  > .profile-card {
    display: flex;
    padding: 15px 5%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    > .btn-section {
      display: flex;
      position: relative;
      flex-direction: row;
      align-self: flex-end;

      > .control-btn {
        display: flex;
        padding: 10px;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        transition-duration: 0.2s;
      }

      > .control-btn:hover {
        cursor: pointer;
        background-color: #ccf;
      }
    }

    > .blank-box {
      height: 40px;
    }

    > .info-box {
      display: flex;
      width: 100%;
      padding: 0 5%;
      flex-direction: row;

      > .avatar {
        width: 75px;
        height: 75px;
        border-radius: 50px;
        background-color: #fff;
        box-shadow: 0px 4px 5px 2px rgba(130, 155, 170, 0.19);
      }

      > .info-section {
        display: flex;
        width: 80%;
        padding: 15px 25px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        > div:first-child {
          position: relative;
          width: 100%;

          > .user-name {
            float: left;
            display: block;
            font-weight: 700;
            font-size: 24px;
            line-height: 24px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          > .follow-btn {
            float: right;
            width: 60px;
            height: 24px;
            border-radius: 100px;
            transition-duration: 0.2s;

            > span {
              display: block;
              padding: 5px;
              font-weight: 400;
              font-size: 14px;
              line-height: 14px;
              text-align: center;
            }
          }

          > .follow-btn:hover {
            cursor: pointer;
            background-color: #ccf;
          }
        }

        > .bio {
          display: block;
          width: 100%;
          padding: 9px 0;
          font-weight: 400;
          font-size: 16px;
          line-height: 16px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    > .follow-box {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: center;
      align-items: stretch;

      > .follow-section {
        display: flex;
        padding: 5px 8%;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;

        > .follow-number {
          padding: 6px;
          font-weight: 700;
          font-size: 14px;
          line-height: 14px;
        }

        > .follow-text {
          width: 60px;
          font-weight: 400;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
  }
}
</style>
