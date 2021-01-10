import React, {
  forwardRef,
  useCallback,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
  Fragment
} from 'react'
import classNames from 'classnames'
import noop from './util/noop'
import debounce from './util/debounce'
import useInterval from './hooks/useInterval'
import useStateRef from './hooks/useStateRef'
import { SwipeRef, SwiperProps } from './types'
import './index.css'

const prefix = 'tiga'

const Swiper = forwardRef<SwipeRef, SwiperProps>(
  (
    {
      autoPlay = 3000,
      selectedIndex = 0,
      touchable = true,
      children,
      className = '',
      duration = 300,
      showIndicators = true,
      showDots = true,
      dots = null,
      indicator = null,
      style = {},
      onChange = noop
    }: SwiperProps,
    ref
  ) => {
    const [node, setNode] = useState<HTMLDivElement | null>(null)
    const [swiperWidth, setSwiperWidth, swiperWidthRef] = useStateRef(0)
    const lastStarX = useRef<number>(0)
    const [active, setActive, activeRef] = useStateRef(selectedIndex)
    const [swiping, setSwiping, swipingRef] = useStateRef(false)
    const [swipeStyle, setSwipeStyle, swipeStyleRef] = useStateRef({
      transform: 'translate3d(0px, 0, 0)',
      transitionDuration: '0ms',
      width: '0px'
    })
    const container = useRef<HTMLDivElement | null>(null)
    const count = React.Children.count(children)
    const childrenArr = React.Children.toArray(children)
    let swipeItems: any = []
    // translate
    const translate = (distance: number, selected: number, isSlient = true) => {
      setSwipeStyle({
        ...swipeStyleRef.current,
        ...{
          transform: `translate3d(${distance}px, 0, 0)`,
          transitionDuration: duration + 'ms'
        }
      })
      setTimeout(() => {
        if (swipingRef.current) setSwiping(false)
        if (isSlient) {
          onChange(selected, activeRef.current)
          setActive(selected)
        }
      }, duration)
    }
    // reset position when moved to cloned element
    const resetPosition = (resetActived: number) => {
      const distance = -(resetActived + 1) * swiperWidthRef.current
      setTimeout(() => {
        setSwipeStyle({
          ...swipeStyle,
          transform: `translate3d(${distance}px, 0, 0)`,
          transitionDuration: '0ms'
        })
      }, duration)
    }
    // get swiper container dom;
    const swiperContainerRef = useCallback((node) => {
      if (node !== null) {
        setNode(node)
      }
    }, [])

    const move = (pace: number): void | boolean => {
      const movePace = activeRef.current + pace
      const distance = -(movePace + 1) * swiperWidthRef.current
      const needRest = movePace >= count || movePace <= -1
      const resetActived = movePace >= count ? 0 : count - 1
      translate(distance, needRest ? resetActived : movePace, pace !== 0)
      if (needRest) {
        resetPosition(resetActived)
      }
    }
    // move to
    const moveTo = (index: number) => {
      const distance = -(index + 1) * swiperWidth
      setSwiping(true)
      translate(distance, index)
    }

    const prev = () => {
      setSwiping(true)
      move(-1)
    }

    const next = () => {
      setSwiping(true)
      move(1)
    }

    const onStartTouch = (e: React.TouchEvent) => {
      const touch = e.targetTouches[0]
      lastStarX.current = touch.pageX
      setSwiping(false)
    }

    const onMoveTouch = (e: React.TouchEvent) => {
      if (touchable || swipingRef.current) {
        const touch = e.targetTouches[0]
        const distance =
          touch.pageX -
          lastStarX.current -
          (activeRef.current + 1) * swiperWidthRef.current
        setSwipeStyle({
          ...swipeStyleRef.current,
          ...{
            transform: `translate3d(${distance}px, 0, 0)`,
            transitionDuration: duration + 'ms'
          }
        })
      }
    }

    const onEndTouch = (e: React.TouchEvent) => {
      const touch = e.changedTouches[0]
      const distance = touch.pageX - lastStarX.current
      const shouldSwipe = Math.abs(distance * 3) > swiperWidthRef.current
      if (distance < 0 && shouldSwipe) {
        move(1)
      } else if (distance > 0 && shouldSwipe) {
        move(-1)
      } else {
        move(0)
      }
    }
    // 初始化
    useEffect((): any => {
      if (node) {
        const measure = () => {
          setSwiperWidth(node.getBoundingClientRect().width)
        }
        const handleResize = debounce(measure, 200)
        measure()
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('resize', handleResize)
          handleResize.cancle()
        }
      }
    }, [node])
    // 定时器
    useInterval(
      () => {
        move(1)
      },
      autoPlay > 0 && !swiping ? autoPlay : null
    )
    // 对外暴露的组件实例
    useImperativeHandle(ref, () => ({
      swipeTo: (index: number) => {
        const target = index >= count ? count - 1 : index
        moveTo(target)
      },
      prev: () => {
        prev()
      },
      next: () => {
        next()
      }
    }))

    useEffect(() => {
      setSwipeStyle({
        ...swipeStyle,
        ...{
          transform: `translate3d(${-(active + 1) * swiperWidth}px, 0, 0)`,
          transitionDuration: duration + 'ms'
        }
      })
    }, [swiperWidth])

    // touch监听
    useEffect((): any => {
      if (container.current) {
        container.current.addEventListener(
          'touchstart',
          onStartTouch as any,
          false
        )
        container.current.addEventListener(
          'touchmove',
          onMoveTouch as any,
          false
        )
        container.current.addEventListener('touchend', onEndTouch as any, false)

        return () => {
          if (container.current) {
            container.current.removeEventListener(
              'touchstart',
              onStartTouch as any,
              false
            )
            container.current.removeEventListener(
              'touchmove',
              onMoveTouch as any,
              false
            )
            container.current.removeEventListener(
              'touchend',
              onEndTouch as any,
              false
            )
          }
        }
      }
    }, [])

    const classes = classNames(`${prefix}-swiper`, className)
    // 进行swipeItems clone
    swipeItems = React.Children.map(
      children,
      (item: React.ReactChild, index: number) => (
        <div
          className={`${prefix}-swiper-item`}
          key={index + 1}
          style={{ width: swiperWidth + 'px' }}
        >
          {item}
        </div>
      )
    )
    if (count !== 0) {
      swipeItems.push(
        <div
          className={`${prefix}-swiper-item`}
          key={count + 1}
          style={{ width: swiperWidth + 'px' }}
        >
          {childrenArr[0]}
        </div>
      )
      swipeItems.unshift(
        <div
          className={`${prefix}-swiper-item`}
          key={0}
          style={{ width: swiperWidth + 'px' }}
        >
          {childrenArr[count - 1]}
        </div>
      )
    }
    // 左右键
    const renderIndicator = (): React.ReactNode => {
      if (indicator) return indicator
      return (
        <Fragment>
          <div
            className={`${prefix}-swiper-indicator ${prefix}-indicator-left`}
            onClick={prev}
          >
            <i className={`${prefix}-indicator-icon`} />
          </div>
          <div
            className={`${prefix}-swiper-indicator ${prefix}-indicator-right`}
            onClick={next}
          >
            <i className={`${prefix}-indicator-icon`} />
          </div>
        </Fragment>
      )
    }
    // 底部的提示
    const renderDots = () => {
      if (dots) return dots
      return (
        <div className={`${prefix}-dots-wrap`}>
          {Array(...Array(count)).map((item, key) => (
            <div
              key={key}
              onClick={() => moveTo(key)}
              className={classNames(`${prefix}-dots`, {
                [`${prefix}-dots-active`]: item === active
              })}
            >
              {item}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={`${prefix}-swiper-wrap`} ref={ref as any}>
        {active}
        {swiping + ''}
        <div ref={swiperContainerRef as any} className={classes} style={style}>
          <div
            style={swipeStyle}
            className={`${prefix}-swiper-container`}
            ref={container as any}
          >
            {swipeItems}
          </div>
          {showIndicators ? renderIndicator() : null}
          {showDots ? renderDots() : null}
        </div>
      </div>
    )
  }
)

export default Swiper
