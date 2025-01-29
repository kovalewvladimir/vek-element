import { debounce } from 'lodash-es'
import { ref } from 'vue'

import { type Column } from './column'

export const useTooltip = (showDelay: number) => {
  const tooltipPosition = ref({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    toJSON() {}
  })
  const tooltipContent = ref('')
  const tooltipVisible = ref(false)
  const tooltipTriggerRef = ref({
    getBoundingClientRect() {
      return tooltipPosition.value
    }
  })

  const tooltipVisibility = (action: 'show' | 'hide', content = '') => {
    if (action === 'hide') {
      tooltipVisible.value = false
      return
    }
    tooltipContent.value = content
    tooltipVisible.value = true
  }
  const debouncedTooltipVisibility = debounce(tooltipVisibility, showDelay)

  const handleCellMouseEnter = (event: MouseEvent, column: Column) => {
    if (column.showOverflowTooltip === false) return
    const cell = event.target as HTMLElement
    if (cell && cell.clientWidth < cell.scrollWidth) {
      tooltipPosition.value = cell.getBoundingClientRect()

      if (cell.textContent) debouncedTooltipVisibility('show', cell.textContent)
    }
  }

  const handleCellMouseLeave = (_event: MouseEvent, column: Column) => {
    if (column.showOverflowTooltip === false) return
    tooltipVisibility('hide')
    debouncedTooltipVisibility('hide')
  }

  return {
    tooltipVisible,
    tooltipContent,
    tooltipTriggerRef,
    handleCellMouseEnter,
    handleCellMouseLeave
  }
}
