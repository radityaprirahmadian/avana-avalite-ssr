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

   const mainBannerArray = [0, 1, 2]
   /**
    * Get only the primary banner image
    * @requires mainBannerArray
    */
   const imgList = useMemo(() => {
      const primaryBannerFilter = (imageObject) => mainBannerArray.includes(imageObject.type);

      return (
         (props?.imgKey
            ? props?.images?.filter(primaryBannerFilter)
            : props?.images) || []
      )
   }, [props?.images])

   const handleOnClick = (imgSelected) => {
      props.onClick(imgSelected);
     }

   const isAnchor = (imgSelected) => imgSelected.type === 0;

   return (
      <Slider className="mt-4" {...settings}>
         {imgList.map((data, index) => (
            <a href={isAnchor(data) ? data.url : "#"} target={isAnchor(data) ? "_blank" : null} key={index} onClick={() => {
               if (!isAnchor(data)) {
                  handleOnClick(data)
               }
            }}>
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
