import styles from './SlickSlider.module.css'

import Slider from 'react-slick'
import { ChevronRight, ChevronLeft } from '@material-ui/icons'
import Img from '../Container/Image'
import { useMemo } from 'react'

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

   // Get only the primary banner image
   const imgList = useMemo(() => {
      const primaryBannerFilter = (imageObject) => imageObject.type === 0;

      return (
         (props?.imgKey
            ? props?.images?.filter(primaryBannerFilter)
            : props?.images) || []
      )
   }, [props?.images])

   const handleOnClick = (imgSelected) => {
      const selectedIdx = imgSelected <= imgList.length
            ? imgSelected - 1
            : 0
          props.onClick(props?.images?.[selectedIdx], selectedIdx);
     }

   return (
      <Slider className="mt-4" {...settings}>
         {imgList.map((data, index) => (
            <a href={data.url} target="_blank" rel="nofollow noindex" key={index} onClick={() => handleOnClick(data)}>
               <Img
                  src={data.image.replace('thumbnail', 'large')}
                  style={{ width: '375px', height: '150px' }}
                  className="rounded-lg object-cover h-full"
               />
            </a>
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
