import { type ShallowRef, unref } from 'vue'

// Readonly<ShallowRef<...>> принимает и обычный ref, и результат useTemplateRef
export const useScrollPosition = (containerPropsRef: Readonly<ShallowRef<HTMLElement | null>>) => {
  let scX = 0
  let scY = 0

  const saveScrollPosition = () => {
    const virtualList = unref(containerPropsRef)
    if (virtualList) {
      scX = unref(virtualList.scrollLeft)
      scY = unref(virtualList.scrollTop)
    }
  }
  const restoreScrollPosition = () => {
    const virtualList = unref(containerPropsRef)

    if (virtualList) {
      virtualList.scrollTo(scX, scY)
    }
  }

  return { saveScrollPosition, restoreScrollPosition }
}
