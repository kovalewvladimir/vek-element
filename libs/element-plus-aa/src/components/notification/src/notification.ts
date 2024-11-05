import { ElMessage } from 'element-plus'
import { h } from 'vue'

type NotificationType = 'success' | 'error'

function ElaNotificationShow(title: string, message: string, type: NotificationType = 'success') {
  if (type === 'success') ElMessage.closeAll()
  let duration = 1000
  switch (type) {
    case 'success':
      duration *= 5
      break
    case 'error':
      console.warn(message)
      duration *= 30
      break
  }
  ElMessage({
    // title,
    message: h('p', { class: 'el-message__content' }, [
      h('p', { style: 'font-weight: bold;' }, title),
      h('p', null, message)
    ]),
    type,
    duration,
    showClose: true,
    plain: true,
    grouping: true
  })
}

export { ElaNotificationShow }
