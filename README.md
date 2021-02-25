# react-tiga-swiper

> a fantastic react swiper component

[![NPM](https://img.shields.io/npm/v/react-tiga-swiper.svg)](https://www.npmjs.com/package/react-tiga-swiper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
  🇨🇳 <a href="https://github.com/xigua1994/react-tiga-swiper/blob/master/README.zh-cn.md">中文版介绍</a>
</p>

## Install

```bash
npm install --save react-tiga-swiper
```

## Usage

```tsx
import React, { useRef, useState } from "react";
import Swiper,{SwipeRef} from 'react-tiga-swiper';
import 'react-tiga-swiper/dist/index.css';

function App() {
  const swiperRef = useRef<SwipeRef>(null);
  const [index, setIndex] = useState<any>();
  const swiperData = ["#99CCCC", "#FFCC99", "#FFCCCC", "#FFFFCC","#CCFFFF"];

  const swipeTo = () => {
    const swiperInstance = swiperRef.current;
    const currPage: string = index * 1 + '';
    swiperInstance?.swipeTo(parseInt(currPage, 10));
  };

  const prev = () => {
    const swiperInstance = swiperRef.current;
    swiperInstance?.prev();
  };

  const next = () => {
    const swiperInstance = swiperRef.current;
    swiperInstance?.next();
  };

  const onChange = (currPage: number, prevPage: number) => {
    console.log(currPage, prevPage);
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="manu-action">
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
          />
          <span className="btn" onClick={swipeTo}>swipe to (index start 0)</span>
        </div>
        <div className="more-action">
          <span className="btn" onClick={prev}>prev</span>
          <span className="btn" onClick={next}>next</span>
        </div>
      </div>
      <Swiper
        className="demo-swiper-container"
        autoPlay={3000}
        selectedIndex={0}
        showIndicators={true}
        indicator={null}
        dots={null}
        direction="vertical"
        loop={false}
        ref={swiperRef}
        onChange={onChange}
      >
        {swiperData.map((item: string, key) => (
          <div key={key} style={{backgroundColor: item}}>{key + 1}</div>
        ))}
      </Swiper>
    </>
  );
}

```

## API

| attribute               | desc                       | type                                  | default     | others                                          |
| ------------------ | -------------------------- | ------------------------------------- | ---------- | ----------------------------------------------- |
| `duration`  | Animation duration(ms)       | `number`   | `300`      |   |
| `autoPlay`   | Autoplay interval(ms)       | `number`  | `3000`     |     |
| `selectedIndex` | index of initial swiper, start from 0 | `number` |  `0` | |
| `direction`   | scroll direction          | `string`  | `horizontal | 'vertical`     |     |
| `loop`   | whether to enable loop       | `bool`           | `true`     |  |
| `touchable`   | whether to enable touchable       | `bool`           | `true`     |  |
| `showIndicators`   | whether to enable show indicators  | `bool` | `true` |  |
| `showDots`    | whether to enable show dots           | `bool`     | `true` | |
| `dots`   | bottom dots  | `React.ReactNode`    | `null`    |   |
| `indicator`   | indicator   | `React.ReactNode`    | `null`    |   |
| `style`     | style   |  `React.CSSProperties` | `{}`    |        |
| `className`   | className  | `string`   | `''`       |    |
| `onChange`  | emitted when currage swipe changed | `(current: number, prev: number): void` | `noop`   |   |

## Swipe Methods

| methods  | desc               | argument | desc                       |
| ------- | ------------------ | ------ | ------------------------------ |
| `swipeTo` | swipe to target index     | `index`  | start 0 |
| `prev`    | swipe to prev item |        |                                |
| `next`    | swipe to next item |        |                                |
## License

MIT © [xigua1994](https://github.com/xigua1994)
