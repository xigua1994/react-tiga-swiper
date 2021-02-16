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

  // const indicator = () => {
  //   return <>
  //     <div className="demo-indicator-arrow demo-indicator-left" onClick={prev}></div>
  //     <div className="demo-indicator-arrow demo-indicator-right" onClick={next}></div>
  //   </>
  // }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="manu-action">
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
          />
          <span className="btn" onClick={swipeTo}>手动跳转页面(从零开始)</span>
        </div>
        <div className="more-action">
          <span className="btn" onClick={prev}>上一页</span>
          <span className="btn" onClick={next}>下一页</span>
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

export default App;
