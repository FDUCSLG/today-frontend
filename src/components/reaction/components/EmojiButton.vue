<template>
  <div
    class="emoji-button"
    :class="{ 'text-primary emoji-button--active': active }"
  >
    <span :style="emojiStyle">{{ emoji }}</span>
    <span
      :style="countStyle"
      class="text-gray-500"
    >{{ count }}</span>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, PropType } from 'vue';
// TODO: 支持长按显示用户列表

export default defineComponent({
  props: {
    /** emoji */
    emoji: { type: String, required: true },
    /** 数目 */
    count: { type: Number, default: 0 },
    /** 激活态 */
    active: { type: Boolean, default: false },
    /** emoji 样式 */
    emojiStyle: { type: Object as PropType<CSSProperties>, default: {} },
    /** 数目样式 */
    countStyle: { type: Object as PropType<CSSProperties>, default: {} },
  },
});
</script>

<style lang="scss" scoped>
.emoji-button {
  flex: 0 0 auto;
  border-radius: 8px;
  background-color: #f2f2f2;
  display: flex;
  padding: 2px 3px;
  align-items: center;
  user-select: none;
  border: 1.5px solid transparent;
  min-width: 38px;

  > span:first-child {
    font-size: 16px;
    line-height: 16px;
    margin-right: 2px;
  }

  > span:last-child {
    font-size: 12px;
    zoom: 0.83;
    line-height: 12px;
  }

  &:active {
    > span:first-child {
      zoom: 0.85;
    }
  }
}

.emoji-button.emoji-button--active {
  background-color: #e3f1f3;
}
</style>
