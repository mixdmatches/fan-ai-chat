<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Sender } from 'ant-design-x-vue'
import { Textarea } from 'ant-design-vue'
import { defineComponent, h, shallowRef } from 'vue'
import { textAreaProps } from 'ant-design-vue/es/input/inputProps'
import type { InputFocusOptions } from 'ant-design-x-vue/typings/sender/interface'
import { triggerFocus } from 'ant-design-vue/es/vc-input/utils/commonUtils'

const textareaRef = ref<HTMLTextAreaElement | null>()
// 定义最大高度，可根据需求调整
const MAX_HEIGHT = 200
// 调整 textarea 高度的函数
const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    // 先将高度设置为自动，以便获取正确的 scrollHeight
    textareaRef.value.style.height = 'auto'
    const scrollHeight = textareaRef.value.scrollHeight
    if (scrollHeight > MAX_HEIGHT) {
      // 当内容高度超过最大高度时，设置高度为最大高度并显示滚动条
      textareaRef.value.style.height = `${MAX_HEIGHT}px`
      textareaRef.value.style.overflowY = 'auto'
    } else {
      // 当内容高度未超过最大高度时，正常调整高度并隐藏滚动条
      textareaRef.value.style.height = `${scrollHeight}px`
      textareaRef.value.style.overflowY = 'hidden'
    }
  }
}

onMounted(() => {
  if (textareaRef.value) {
    // 监听输入事件，触发高度调整
    textareaRef.value.addEventListener('input', adjustTextareaHeight)
    // 初始化时调整一次高度
    adjustTextareaHeight()
  }
})

onUnmounted(() => {
  if (textareaRef.value) {
    // 移除事件监听器，避免内存泄漏
    textareaRef.value.removeEventListener('input', adjustTextareaHeight)
  }
})

const CustomTextarea = defineComponent({
  name: 'MyInputTextArea',
  props: textAreaProps(),
  setup(props, { attrs, expose }) {
    const textAreaRef = shallowRef()

    const focus = (option?: InputFocusOptions) => {
      triggerFocus(textAreaRef.value, option)
    }
    const blur = () => {
      textAreaRef.value?.blur()
    }

    expose({
      focus,
      blur,
    })

    return () =>
      h(Textarea, {
        ...attrs,
        ...props,
        value: props.value,
        disabled: props.disabled,
        ref: textAreaRef,
        bordered: false,
        showCount: true,
        maxlength: 1000,
        autoSize: { minRows: 3, maxRows: 6 },
        placeholder: 'Type your message here...',
      })
  },
})

const inputValue = ref('')

const onChange = (v: string) => {
  inputValue.value = v
}
const onSubmit = (message: string) => {
  console.log('Submitted:', message)
  inputValue.value = ''
}
</script>

<template>
  <div class="chat-input-box">
    <Sender
      :value="inputValue"
      :components="{ input: CustomTextarea }"
      :auto-size="{ minRows: 2, maxRows: 6 }"
      @change="onChange"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
@media screen and (max-width: 1024px) {
  body .chat-input-box {
    padding: $gap-l;
  }
}
.chat-input-box {
  width: 100%;
  padding: 0 $gap-l * 8 $gap-l;
  position: sticky;
  bottom: 0;
  left: 0;
  @include themify(
    (
      background-color: $bg-color,
    )
  );
  z-index: 999;
  transition: all 0.3s ease;
}
.input-box {
  width: 100%;
  border: 1px solid transparent;
  padding: $gap-m;
  border-radius: $rad-l;
  @include themify(
    (
      background-color: $input-bg-color,
    )
  );
  textarea {
    resize: none;
    height: auto;
    width: 100%;
    background-color: transparent;
    overflow-y: hidden;
    font-size: $fs-m;
    color: $text-color-const;
    &::placeholder {
      color: #999;
      font-size: $fs-m;
    }
  }
  .work {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $gap-m;
  }
}
</style>
