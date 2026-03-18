<script setup lang="ts">
import { computed, ref } from 'vue'
import { Sender } from 'ant-design-x-vue'
import { Textarea, message } from 'ant-design-vue'
import { defineComponent, h, shallowRef } from 'vue'
import { textAreaProps } from 'ant-design-vue/es/input/inputProps'
import {
  triggerFocus,
  type InputFocusOptions,
} from 'ant-design-vue/es/vc-input/utils/commonUtils'
import { useConversationStore } from '@/stores/conversation'
import { openai } from '@/utils/alibaba'
import { storeToRefs } from 'pinia'

const conversationStore = useConversationStore()
const { currentConversationId, currentConversation } =
  storeToRefs(conversationStore)

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
const lastMessageStop = computed(() => {
  const length = currentConversation.value?.messages.length || 0
  if (length) return currentConversation.value?.messages[length - 1].isStop
  return false
})

const onChange = (v: string) => {
  inputValue.value = v
}
const onSubmit = async (question: string) => {
  if (!question.trim()) return message.warn('请输入问题')

  inputValue.value = ''
  conversationStore.addMessage(question, 'user')
  conversationStore.setConversationTalking(currentConversationId.value, true)

  const waitingMessageId = conversationStore.addMessage('等待中', 'assistant')

  if (waitingMessageId) {
    let streamContent = ''
    try {
      const completion = await openai.chat.completions.create({
        model: 'qwen3.5-flash',
        messages: [{ role: 'user', content: question }],
        stream: true,
        stream_options: { include_usage: false },
      })
      for await (const chunk of completion) {
        // 取消输出
        if (lastMessageStop.value) return
        const content = chunk.choices[0].delta?.content || ''
        streamContent += content
        if (streamContent) {
          conversationStore.updateMessage(waitingMessageId, streamContent)
        }
      }
    } catch (e) {
      console.error('AI 调用错误:', e)
      // 更新等待消息为错误提示
      conversationStore.updateMessage(
        waitingMessageId,
        '抱歉，我暂时无法回答你的问题，请稍后再试。',
      )
    } finally {
      conversationStore.setConversationTalking(
        currentConversationId.value,
        false,
      )
    }
  } else {
    conversationStore.setConversationTalking(currentConversationId.value, false)
  }
}

// 取消AI输出
const onCancel = () => {
  // 直接获取当前对话的最后一条消息
  const currentConv = conversationStore.getCurrentConversation()
  if (currentConv && currentConv.messages.length > 0) {
    const lastMessage = currentConv.messages[currentConv.messages.length - 1]
    if (lastMessage.role === 'assistant') {
      conversationStore.setMessageStop(lastMessage.id, true)
    }
  }
}
</script>

<template>
  <div class="chat-input-box">
    <Sender
      :value="inputValue"
      :components="{ input: CustomTextarea }"
      :auto-size="{ minRows: 2, maxRows: 6 }"
      :loading="currentConversation?.isTalking"
      @change="onChange"
      @submit="onSubmit"
      @cancel="onCancel"
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
