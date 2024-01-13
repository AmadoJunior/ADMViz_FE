import * as React from 'react'
import useResizeObserver from '@react-hook/resize-observer'

const useSize = <T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options?: UseSizeOptions
): [number, number] => {
  const [size, setSize] = React.useState<[number, number]>(() => {
    const targetEl = target && 'current' in target ? target.current : target
    return targetEl
      ? [targetEl.scrollWidth, targetEl.scrollHeight]
      : [options?.initialWidth ?? 0, options?.initialHeight ?? 0]
  })

  React.useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return
    setSize([targetEl.scrollWidth, targetEl.scrollHeight])
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    const target = entry.target as HTMLElement
    console.log(target);
    setSize([target.scrollWidth, target.scrollHeight])
  })

  return size
}

export interface UseSizeOptions {
  // The initial width to set into state.
  // This is useful for SSR environments.
  initialWidth: number
  // The initial height to set into state.
  // This is useful for SSR environments.
  initialHeight: number
}

export default React.memo(useSize)