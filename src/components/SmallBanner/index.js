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
          <Img src={image.replace('thumbnail', 'large')} style={{ height: "93.75px", width: "93.75px"}} />
        </div>
      ))}
    </section>
  )
}

export default SmallBanner