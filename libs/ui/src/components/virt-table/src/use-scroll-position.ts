import { type Ref, unref } from 'vue'

export const useScrollPosition = (containerPropsRef: Ref<HTMLElement | null>) => {
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
