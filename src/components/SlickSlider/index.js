import styles from './SlickSlider.module.css'

import Slider from 'react-slick'
import { ChevronRight, ChevronLeft } from '@material-ui/icons'
import Img from '../Container/Image'
import { useEffect, useMemo, useState } from 'react'

const SlickSlider = (props) => {

   const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      swipeToSlide: true,
      focusOnSelect: true,
      nextArrow: <CustomNextArrow />,
      prevArrow: <CustomPrevArrow />,
      dotsClass: `slick-dots ${styles.dots}`,
   }

   const imgList = useMemo(() => {
      return (
         (props?.imgKey
            ? props?.images?.map((data) => data?.[props?.imgKey] || '')
            : props?.images) || []
      )
   }, [props?.images])



   return (
      <Slider className="mt-4" {...settings}>
         {imgList.map((image, index) => (
            <div key={index}>
               <Img
                  src={image.replace('thumbnail', 'large')}
                  style={{ width: '375px', height: '150px' }}
                  className="rounded-lg object-cover h-full"
               />
            </div>
         ))}
      </Slider>
   )
}

export default SlickSlider

const CustomPrevArrow = ({ className, style, onClick }) => {
   return (
      <div
         className={`ml-8 z-10 w-8 h-8 ${styles.arrow} ${className}`}
         style={{ ...style }}
         onClick={onClick}
      >
         <ChevronLeft className="z-10 cursor-pointer absolute top-0 bottom-0 left-0 right-0 m-auto text-white" />
      </div>
   )
}

const CustomNextArrow = ({ className, style, onClick }) => {
   return (
      <div
         className={`mr-8 z-10 w-8 h-8 ${styles.arrow} ${className}`}
         style={{ ...style }}
         onClick={onClick}
      >
         <ChevronRight className="z-10 cursor-pointer absolute top-0 bottom-0 left-0 right-0 m-auto text-white" />
      </div>
   )
}
