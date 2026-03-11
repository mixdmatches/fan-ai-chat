<script setup lang="ts">
import { ref } from 'vue'
import { Sender } from 'ant-design-x-vue'
import { Textarea } from 'ant-design-vue'
import { defineComponent, h, shallowRef } from 'vue'
import { textAreaProps } from 'ant-design-vue/es/input/inputProps'
import type { InputFocusOptions } from 'ant-design-x-vue/typings/sender/interface'
import { triggerFocus } from 'ant-design-vue/es/vc-input/utils/commonUtils'
import { useConversationStore } from '@/stores/conversation'
import { openai } from '@/utils/alibaba'

const conversationStore = useConversationStore()

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
const onSubmit = async (message: string) => {
  if (!message.trim()) return

  inputValue.value = ''
  conversationStore.addMessage(message, 'user')
  conversationStore.isTalking = true

  const waitingMessageId = conversationStore.addMessage('等待中', 'assistant')

  if (waitingMessageId) {
    let streamContent = ''
    try {
      const completion = await openai.chat.completions.create({
        model: 'qwen3.5-flash',
        messages: [{ role: 'user', content: message }],
        stream: true,
        stream_options: { include_usage: false },
      })
      for await (const chunk of completion) {
        const content = chunk.choices[0].delta?.content || ''
        streamContent += content
        if (streamContent) {
          conversationStore.updateMessage(waitingMessageId, streamContent)
        }
      }
      console.error('AI 调用错误:', e)
      // 更新等待消息为错误提示
      conversationStore.updateMessage(
        waitingMessageId,
        '抱歉，我暂时无法回答你的问题，请稍后再试。',
      )
    } finally {
      conversationStore.isTalking = false
    }
  } else {
    conversationStore.isTalking = false
  }
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
  background-color: #fff;
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
