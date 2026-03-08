import type { App } from 'vue'
import vTooltip from './tooltip'

export default {
  install(app: App) {
    app.directive('tooltip', vTooltip)
  },
}
