import { useEffect, useRef } from 'react';

type cbType = (...args: any[]) => void;

function useTimoutInsteadInterval(fn,delay){
  const cbRef = useRef<cbType>();
  let timer: any = null;

  useEffect(() => {
    cbRef.current = fn;
  }, [fn])

  const tick = () => {
    if(cbRef.current){
      cbRef.current();
    }
  }

  useEffect(():any => {
    const timeout = () => {
      if(delay !== null){
        timer = setTimeout(() => {
          tick();
          timeout();
        },delay)
      }
    }
    timeout();
    return () => {
      if(timer){
        clearTimeout(timer);
      }
    }

  },[delay])
}

export default useTimoutInsteadInterval;