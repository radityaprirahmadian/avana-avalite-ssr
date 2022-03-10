import React, { useRef, useState, useCallback, useEffect } from 'react';

import { ChevronRight, ChevronLeft, FiberManualRecord as Dots } from '@material-ui/icons';
import Img from '../Container/Image';
// import './ImgDrawer.scss';

export default function ImgDrawer(props) {
  const [imgSelected, setImgSelected] = useState(props?.images?.length ? 1 : 0);
  const [scale, setScale] = useState({
    hypot: null,
    x: null,
    y: null,
  })
  const [swipe, setSwipe] = useState({
    x: 0,
    x2: 0,
    initOffset: 0,
    listPosition: [],
    swiped: true,
    swiping: false,
    onTransition: false,
    onOneFinger: false,
    onTwoFinger: false,
  });
  const minDistance = 50;
  const minScale = 1;
  // const maxScale = 4;
  
  const MainContainer = useRef();
  const imgContainer = useRef();
  const ImgRef = useRef();

  const [imgWidth, setImgWidth] = useState(0);
  const [imgContainerWidth, setImgContainerWidth] = useState(0);
  // const [offset, setOffset] = useState(0);

  const nextImg = useCallback((e) => {
    if (swipe.onTransition) {
      return;
    }
    setSwipe((prev) => {
      let arrPosition
      if (prev.listPosition.length === 0) {
        arrPosition = (props?.images?.map((_, idx) => {
          return imgContainer.current.offsetLeft * (idx + 1);
        }));
        if (arrPosition?.length) {
          arrPosition.unshift(imgContainer.current.offsetLeft - imgContainer.current.offsetLeft);
          arrPosition.push(imgContainer.current.offsetLeft * (props?.images?.length + 1));
        }
      } else {
        arrPosition = prev.listPosition;
      }
      imgContainer.current.classList.add('shifting');
      console.log(`${arrPosition?.[imgSelected + 1]}px`, arrPosition, imgSelected + 1)
      imgContainer.current.style.left = `${arrPosition?.[imgSelected + 1] || -300}px`;
      setImgSelected(imgSelected + 1);
      return {
        ...prev,
        onTransition: e ? true : false,
        listPosition: arrPosition || prev.listPosition,
      }
    })
  }, [imgSelected, props, swipe]);

  const prevImg = useCallback((e) => {
    if (swipe.onTransition) {
      return;
    }
    setSwipe((prev) => {
      let arrPosition
      if (prev.listPosition.length === 0) {
        arrPosition = (props?.images?.map((_, idx) => {
          return imgContainer.current.offsetLeft * (idx + 1);
        }));
        if (arrPosition?.length) {
          arrPosition.unshift(imgContainer.current.offsetLeft - imgContainer.current.offsetLeft);
          arrPosition.push(imgContainer.current.offsetLeft * (props?.images?.length + 1));
        }
      } else {
        arrPosition = prev.listPosition;
      }
      imgContainer.current.classList.add('shifting');
      console.log(`${arrPosition?.[imgSelected - 1]}px`, arrPosition, imgSelected - 1)
      imgContainer.current.style.left = `${arrPosition?.[imgSelected - 1] ?? -300}px`;
      setImgSelected(imgSelected - 1);
      return {
        ...prev,
        onTransition: e ? true : false,
        listPosition: arrPosition || prev.listPosition,
      }
    })
  }, [imgSelected, props, swipe]);

  const fnTranstionEnd = useCallback(() => {
    imgContainer.current.classList.remove('shifting');
    if (imgSelected === props.images.length + 1) {
      imgContainer.current.style.left = `${swipe?.listPosition?.[1]}px`;
      setImgSelected(1);
    } else if (imgSelected === 0) {
      imgContainer.current.style.left = `${swipe?.listPosition?.[props.images.length]}px`;
      setImgSelected(props.images.length);
    }
    setSwipe((prev) => ({
      ...prev,
      onTransition: false,
    }));
  }, [imgSelected, swipe, props]);

  const fnTouchMove = useCallback((e) => {
    e.persist && e.persist();
    let touch = e.type === 'touchmove' ? e.touches[0] : e;
    if (!swipe.swiped && !swipe.onTwoFinger && props?.images?.length > 1) {
      setSwipe((prev) => {
        let posx2 = prev.x - touch.clientX;
        imgContainer.current.style.left = `${imgContainer.current.offsetLeft - posx2}px`;
        return ({
          ...prev,
          swiping: true,
          x: touch.clientX,
          x2: posx2,
        })
      });
    } else if (!swipe.swiped && swipe.onTwoFinger)  {
      let distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      )/100;
      let xPos = Math.max(e.touches[0].pageX, e.touches[1].pageX);
      let yPos = Math.max(e.touches[0].pageY, e.touches[1].pageY);
      !scale.hypot && setScale(() => ({
        hypot: distance,
        x: xPos,
        y: yPos,
      }));
      let imgScale = Math.max(minScale, (distance/scale.hypot));
      ImgRef.current.style.transform = `translate3d(${xPos-scale.x}px, ${yPos-scale.y}px, 0) scale(${imgScale})`;
    }
  }, [swipe, scale, props]);

  const fnTouchEnd = useCallback((e) => {
    e.persist && e.persist();
    if (!swipe.onTwoFinger && props?.images?.length > 1) {
      const touch = e.type === 'touchend' ? e.changedTouches[0] : e;
      const absX = Math.abs(touch.clientX - swipe.initX);
      const imgMoreThanOne = props?.images?.length > 1;
      if (swipe.swiping && absX > minDistance && touch.clientX > swipe.initX && imgMoreThanOne) {
        prevImg();
      } else if (swipe.swiping && absX > minDistance && touch.clientX < swipe.initX && imgMoreThanOne) {
        nextImg();
      } else {
        imgContainer.current.classList.add('shifting');
        imgContainer.current.style.left = `${swipe?.listPosition?.[imgSelected]}px`;
      }
    }
    setSwipe((prev) => ({
      ...prev,
      onTransition: swipe.onOneFinger ? true : false,
      swiping: false,
      swiped: true,
      x: 0,
      onOneFinger: false,
      onTwoFinger: false,
    }));
  }, [swipe, nextImg, prevImg, imgSelected, props]);

  const fnTouchStart = useCallback((e) => {
    e.persist && e.persist();
    if (swipe.onTransition) {
      return;
    }
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    setScale(() => ({
      hypot: null,
      x: null,
      y: null,
    }));
    setSwipe((prev) => {
      let arrPosition
      if (prev.listPosition.length === 0) {
        arrPosition = (props?.images?.map((_, idx) => {
          return imgContainer.current.offsetLeft * (idx + 1);
        }));
        if (arrPosition?.length) {
          arrPosition.unshift(imgContainer.current.offsetLeft - imgContainer.current.offsetLeft);
          arrPosition.push(imgContainer.current.offsetLeft * (props?.images?.length + 1));
        }
      }
      return {
        ...prev,
        swiped: false,
        initOffset: imgContainer.current.offsetLeft,
        x: touch.clientX,
        initX: touch.clientX,
        listPosition: arrPosition || prev.listPosition,
        ...(e.type === 'touchstart' && e.touches.length > 1 ? {onTwoFinger: true, onOneFinger: false} : {onTwoFinger: false, onOneFinger: true})
      }
    })
  }, [swipe, props]);

  useEffect(() => {
    const width = MainContainer?.current?.clientWidth;
    setImgWidth(width);
    setImgContainerWidth(width*(props?.images?.length || 1) * 3);
    // setOffset(MainContainer?.current?.offsetWidth);
    // imgContainer.current.onmousemove = fnTouchMove;
  }, [props]);

  useEffect(() => {
    setImgSelected(1);
    imgContainer.current.classList.add('shifting');
    imgContainer.current.style.left = `${-300}px`;
  }, [props.images]);

  return (
    <div
      ref={MainContainer}
      className="absolute w-full h-full top-0 bottom-0 left-0 right-0"
    >
      <div
        className="flex w-full h-full items-center absolute"
        style={{
          justifyContent: props?.images?.length > 1 ? 'space-between' : 'center',
          visibility: swipe.onTwoFinger ? 'hidden' : 'visible',
        }}
      >
        {
          props?.images?.length > 1 && (
            <div
              onClick={prevImg}
              className="z-10 cursor-pointer relative m-1"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: '30px',
                height: '30px',
              }}
            >
              <ChevronLeft
                className="z-10 cursor-pointer absolute top-0 bottom-0 left-0 right-0 m-auto text-white"
              />
            </div>
          )
        }
        <div
          className="z-10 self-end p-4"
        >
          {props?.images?.map((_, idx) => (
            <Dots
              className="z-10"
              style={{
                fontSize: '18px',
                color: idx + 1 === imgSelected ? '#FDB814' : '#CCCCCC'
              }}
            />
          ))}
        </div>
        {
          props?.images?.length > 1 && (
            <div
              onClick={nextImg}
              className="z-10 cursor-pointer relative m-1"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: '30px',
                height: '30px',
              }}
            >
              <ChevronRight
                className="z-10 cursor-pointer absolute top-0 bottom-0 left-0 right-0 m-auto text-white"
              />
            </div>
          )
        }
      </div>
      <div
        className="w-full h-full relative rounded-lg"
      >
        {
          swipe.onTwoFinger && (
            <>
              <div
                className="flex absolute h-full z-50"
                // style={{
                //   display: 'flex',
                //   position: 'absolute',
                //   height: '100%',
                //   zIndex: '99'
                // }}
              >
                <div
                  style={{ width: `${imgWidth}px` }}
                  className="img-item relative h-full"
                  ref={ImgRef}
                >
                  <Img
                    src={props?.images[imgSelected - 1].replace('thumbnail', 'large')}
                    className="w-full h-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-white select-none"
                  />
                </div>
              </div>
            </>
          )
        }
         <div
          className="overflow-hidden relative h-full rounded-lg"
        >
          <div
            style={{
              visibility: swipe.onTwoFinger ? 'hidden' : 'visible',
              width: `${imgContainerWidth}px`,
              left: `-${imgWidth}px`,
            }}
            ref={imgContainer}
            id="img-container"
            className="img-container flex relative h-full top-0"
            onTransitionEnd={fnTranstionEnd}
            onTouchStart={fnTouchStart}
            onTouchMove={fnTouchMove}
            onTouchEnd={fnTouchEnd}
            onMouseDown={fnTouchStart}
            onMouseMove={(e) => {!swipe.swiped && fnTouchMove(e)}}
            onMouseUp={(e) => {(!swipe.swiped && swipe.swiping) && fnTouchEnd(e)}}
          >
            <div
              style={{ width: `${imgWidth}px` }}
              className="img-item relative h-full"
            >
              {
                props?.images?.length > 1 && (
                  <Img
                    src={props?.images[props?.images?.length - 1].replace('thumbnail', 'large')}
                    className="w-full h-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-white select-none"
                  />
                )
              }
            </div>
            {
              props?.images?.map((img, idx) => (
                <div
                  style={{
                    position: 'relative',
                    height: '100%',
                    width: `${imgWidth}px`
                  }}
                  className="img-item"
                >
                  <Img
                    src={img.replace('thumbnail', 'large')}
                    className="w-full h-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-white select-none"
                  />
                </div>
              ))
            }
            <div
              style={{ width: `${imgWidth}px` }}
              className="img-item relative h-full"
            >
              {
                props?.images?.length > 1 && (
                  <Img
                    src={props?.images[0].replace('thumbnail', 'large')}
                    className="w-full h-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-white select-none"
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}