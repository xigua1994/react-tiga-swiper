import React, {
  forwardRef,
  useCallback,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
  Fragment,
  useMemo
} from 'react'
import classNames from 'classnames'
import noop from './util/noop'
import debounce from './util/debounce'
import useTimoutInsteadInterval from './hooks/useTimoutInsteadInterval'
import useStateRef from './hooks/useStateRef'
import { SwipeRef, SwiperProps } from './types'
import './index.scss'
const prefix = 'tiga'

const Swiper = forwardRef<SwipeRef, SwiperProps>(
  (
    {
      autoPlay = 3000,
      direction = 'horizontal',
      loop = true,
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
    const [swiperAttrStyle, setswiperAttrStyle, swiperAttrStyleRef] = useStateRef(0)
    const lastStarX = useRef<number>(0)
    const [active, setActive, activeRef] = useStateRef(selectedIndex)
    const [swiping, setSwiping, swipingRef] = useStateRef(false)
    const [swipeStyle, setSwipeStyle, swipeStyleRef] = useStateRef({
      transform: 'translate3d(0px, 0, 0)',
      transitionDuration: '0ms',
      nodeAttr: '0px'
    })
    const count = React.Children.count(children)
    const nodeAttr = useMemo(() => (direction === 'horizontal' ? "width" : "height"), [direction]);
    const canAutoMove = useMemo(() => !(!loop && active === count - 1), [loop, active, count]);
    const tickMove = useMemo(() => canAutoMove && !swiping && autoPlay > 0,[canAutoMove, swiping, autoPlay])
    const aditionPage = useMemo(() => (loop ? 1 : 0) ,[loop]);
    const container = useRef<HTMLDivElement | null>(null)
    const childrenArr = React.Children.toArray(children)
    let swipeItems: any = []
    // translate
    const translate = (distance: number, selected: number, isSlient = true) => {
      setSwipeStyle({
        ...swipeStyleRef.current,
        ...{
          transform: `translate3d(${nodeAttr === 'width' ?  distance : 0}px, ${nodeAttr === 'height' ?  distance : 0}px, 0)`,
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
      const distance = -(resetActived + 1) * swiperAttrStyleRef.current
      setTimeout(() => {
        setSwipeStyle({
          ...swipeStyle,
          transform: `translate3d(${nodeAttr === 'width' ?  distance : 0}px, ${nodeAttr === 'height' ?  distance : 0}px, 0)`,
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
      const distance = -(movePace + aditionPage) * swiperAttrStyleRef.current
      const needRest = movePace >= count || movePace <= -1
      const resetActived = movePace >= count ? 0 : count - 1
      translate(distance, needRest ? resetActived : movePace, pace !== 0)
      if (needRest && loop) {
        resetPosition(resetActived)
      }
    }
    // move to
    const moveTo = (index: number) => {
      const distance = -(index + aditionPage) * swiperAttrStyle
      setSwiping(true)
      translate(distance, index)
    }

    const prev = () => {
      setSwiping(true)
      if(loop || (!loop && activeRef.current !== 0)){
        move(-1)
      }
    }

    const next = () => {
      setSwiping(true)
      if(loop || (!loop && activeRef.current !== count - 1)){
        move(1)
      }
    }

    const onStartTouch = (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.targetTouches[0]
      lastStarX.current = nodeAttr === 'width' ?  touch.pageX : touch.pageY
      setSwiping(true)
    }

    const onMoveTouch = (e: React.TouchEvent) => {
      e.preventDefault();
      if (touchable || swipingRef.current) {
        const touch = e.targetTouches[0]
        const distance =
          (nodeAttr === 'width' ?  touch.pageX : touch.pageY) -
          lastStarX.current -
          (activeRef.current + aditionPage) * swiperAttrStyleRef.current
        setSwipeStyle({
          ...swipeStyleRef.current,
          ...{
            transform: `translate3d(${nodeAttr === 'width' ?  distance : 0}px, ${nodeAttr === 'height' ?  distance : 0}px, 0)`,
            transitionDuration: duration + 'ms'
          }
        })
      }
    }

    const onEndTouch = (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.changedTouches[0]
      const distance = (nodeAttr === 'width' ?  touch.pageX : touch.pageY) - lastStarX.current
      const unLoopEdge = !loop && ((distance > 0 && activeRef.current > 0 ) || (distance < 0 && activeRef.current < count - 1));
      const shouldSwipe = Math.abs(distance * 3) > swiperAttrStyleRef.current && ( loop || unLoopEdge);
      if (distance < 0 && shouldSwipe) {
        move(1)
      } else if (distance > 0 && shouldSwipe) {
        move(-1)
      } else {
        move(0)
      }
    }

    // init
    useEffect((): any => {
      if (node) {
        const measure = () => {
          setswiperAttrStyle(node.getBoundingClientRect()[nodeAttr])
        }
        const handleResize = debounce(measure, 200)
        measure()
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('resize', handleResize)
          handleResize.cancle()
        }
      }
    }, [node,nodeAttr])
    // use setTimeout instead of setInterval
    useTimoutInsteadInterval(
      () => {
        if(loop || (!loop && activeRef.current !== count - 1)){
          move(1)
        }
      },
      tickMove ? autoPlay : null
    )
    // ref instance
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
      const distance = -(active + aditionPage) * swiperAttrStyle;
      setSwipeStyle({
        ...swipeStyle,
        ...{
          transform: `translate3d(${nodeAttr === 'width' ?  distance : 0}px, ${nodeAttr === 'height' ?  distance : 0}px , 0)`,
          transitionDuration: duration + 'ms'
        }
      })
    }, [swiperAttrStyle])

    // listene attch event
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

    const classes = classNames(`${prefix}-swiper ${prefix}-swiper__${direction}`, className)
    swipeItems = React.Children.map(
      children,
      (item: React.ReactChild, index: number) => (
        <div
          className={`${prefix}-swiper-item`}
          key={index + 1}
          style={{ nodeAttr: swiperAttrStyle + 'px' } as React.CSSProperties}
        >
          {item}
        </div>
      )
    )
    // clone first element and last element
    if (count !== 0 && loop) {
      swipeItems.push(
        <div
          className={`${prefix}-swiper-item`}
          key={count + 1}
          style={{ nodeAttr: swiperAttrStyle + 'px' } as React.CSSProperties}
        >
          {childrenArr[0]}
        </div>
      )
      swipeItems.unshift(
        <div
          className={`${prefix}-swiper-item`}
          key={0}
          style={{ nodeAttr: swiperAttrStyle + 'px' } as React.CSSProperties}
        >
          {childrenArr[count - 1]}
        </div>
      )
    }
    // left and right indicator
    const renderIndicator = (): React.ReactNode => {
      if (indicator) return indicator
      return (
        <Fragment>
          <div
            className={`${prefix}-swiper-indicator ${prefix}-indicator-left ${!loop && active === 0 ? (prefix+'-indicator__disable') : ''}`}
            onClick={prev}
          >
            <i className={`${prefix}-indicator-icon`}>
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1121" width="200" height="200"><path d="M755.499 115.499a42.667 42.667 0 0 0-60.331-60.331L268.501 481.835a42.667 42.667 0 0 0 0 60.33l426.667 426.667a42.667 42.667 0 0 0 60.33-60.33L358.999 512l396.5-396.501z" p-id="1122"></path></svg>
            </i>
           </div>
          <div
            className={`${prefix}-swiper-indicator ${prefix}-indicator-right ${!loop && active === count-1 ? (prefix+'-indicator__disable') : ''}`}
            onClick={next}
          >
             <i className={`${prefix}-indicator-icon`}>
             <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1531" width="200" height="200"><path d="M268.501 908.501a42.667 42.667 0 0 0 60.331 60.331l426.667-426.667a42.667 42.667 0 0 0 0-60.33L328.832 55.168a42.667 42.667 0 0 0-60.33 60.33L665.001 512l-396.5 396.501z" p-id="1532"></path></svg></i>
          </div>
        </Fragment>
      )
    }
    // bottom dots
    const renderDots = () => {
      if (dots) return dots
      return (
        <div className={`${prefix}-dots-wrap`}>
          {Array(...Array(count)).map((item, key) => (
            <div
              key={key}
              onClick={() => moveTo(key)}
              className={classNames(`${prefix}-dots`, {
                [`${prefix}-dots-active`]: key === active
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
        <div ref={swiperContainerRef as any} className={classes} style={style}>
          <div
            style={swipeStyle}
            className={`${prefix}-swiper-container ${prefix}-swiper-container__${direction}`}
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
