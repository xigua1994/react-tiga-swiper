import React, { useRef, useState } from "react";
import Swiper,{SwipeRef} from 'react-tiga-swiper';
import 'react-tiga-swiper/dist/index.css';
function App() {
  const swiperRef = useRef<SwipeRef>(null);
  const [index, setIndex] = useState<string>();
  const swiperData = ["green", "red", "yellow", "black"];

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
        style={{ height: "100px", border: "1px solid black" }}
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
  );
}

export default App;
