import { useEffect, useMemo, useState } from 'react'
import Img from '../Container/Image'

const SmallBanner = (props) => {

  // Get only the small banner image
  const imgList = useMemo(() => {
    const smallBannerFilter = (imageObject) => imageObject.type === 1;

    return (
       (props?.imgKey
          ? props?.images?.filter(smallBannerFilter).map((data) => data?.[props?.imgKey] || '')
          : props?.images) || []
    )
 }, [props?.images])
  
  return (
    <section className="grid grid-cols-4">
      {imgList.map((image, index) => (
        <div key={index} className="relative w-full border border-transparent">
          <h2 style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} className="absolute z-10 text-white text-xl">{/*Overlay*/}</h2>
          <Img src={image.replace('thumbnail', 'large')} style={{ height: "93.75px", width: "93.75px"}} />
        </div>
      ))}
    </section>
  )
}

export default SmallBanner