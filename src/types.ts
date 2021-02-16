import * as React from 'react'

export interface SwipeRef {
  swipeTo: (index: number) => void
  prev: () => void
  next: () => void
}

export interface SwiperProps {
  autoPlay?: number
  selectedIndex?: number
  children?: React.ReactNode
  direction?: 'horizontal' | 'vertical',
  loop?: boolean,
  className?: string
  touchable?: boolean
  duration?: number
  indicator?: React.ReactNode
  showIndicators?: boolean
  showDots?: boolean
  dots?: React.ReactNode
  style?: React.CSSProperties
  onChange?: (selected: number, prevSelected: number) => any
}
