# react-tiga-swiper

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-tiga-swiper.svg)](https://www.npmjs.com/package/react-tiga-swiper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-tiga-swiper
```

## Usage

```tsx
import React, { Component } from 'react'

import Swiper,{SwipeRef} from 'react-tiga-swiper';
import 'react-tiga-swiper/dist/index.css';
const swiperData = ["#99CCCC", "#FFCC99", "#FFCCCC", "#FFFFCC","#CCFFFF"];

function Example(props){

  const swiperRef = useRef<SwipeRef>(null);
  const [index, setIndex] = useState<any>();

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
        <input
          type="number"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <span onClick={swipeTo}>手动跳转页面</span>
        <span onClick={prev}>上一页</span>
        <span onClick={next}>下一页</span>
      </div>
      <Swiper
        autoPlay={3000}
        style={{ height: "100px"}}
        selectedIndex={0}
        showIndicators={true}
        indicator={null}
        dots={null}
        ref={swiperRef}
        onChange={onChange}
      >
        {swiperData.map((item: string, key) => (
          <div key={key} style={{backgroundColor: item}}>{key + 1}</div>
        ))}
      </Swiper>
    </>
  )
}
```

## API

| 参数               | 说明                       | 类型                                  | 默认值     | 备选值                                          |
| ------------------ | -------------------------- | ------------------------------------- | ---------- | ----------------------------------------------- |
| `duration`  | 切换动画持续时间(ms)       | `number`   | `300`      |   |
| `autoPlay`   | 自动切换间隔时间(ms)       | `number`  | `3000`     |     |
| `touchable`   | 是否允许滑动       | `bool`           | `true`     |  |
| `showIndicators`   | 是否显示两侧翻页按钮  | `bool` | `true` |  |
| `showDots`    | 是否显示底部dots           | `bool`     | `true` | |
| `dots`   | 底部dots  | `React.ReactNode`    | `null`    |   |
| `indicator`   | 两侧翻页按钮   | `React.ReactNode`    | `null`    |   |
| `style`     | 自定义额外样式   |  `React.CSSProperties` | `{}`    |        |
| `className`   | 自定义额外类名  | `string`   | `''`       |    |
| `onChange`  | 切换时回调函数 | `(current: number, prev: number): void` | `noop`   |   |

## 实例方法

| 方法名  | 说明               | 参数名 | 参数描述                       |
| ------- | ------------------ | ------ | ------------------------------ |
| `swipeTo` | 手动切换轮播图     | `index`  | 需要切换的轮播图索引,从 0 开始 |
| `prev`    | 切换至上一张轮播图 |        |                                |
| `next`    | 切换至下一张轮播图 |        |                                |
## License

MIT © [xigua1994](https://github.com/xigua1994)
