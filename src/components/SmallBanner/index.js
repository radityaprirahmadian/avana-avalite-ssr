import { useMemo, useState } from 'react'
import Img from '../Container/Image'

const SmallBanner = (props) => {

  // Get only the small banner image
  const imgList = useMemo(() => {
    const smallBannerFilter = (imageObject) => imageObject.type === 3;

    return (
       (props?.imgKey
          ? props?.images?.filter(smallBannerFilter)
          : props?.images) || []
    )
 }, [props?.images])

 const handleOnClick = (imgSelected) => {
      props.onClick(imgSelected);
 }
  
  return (
    <section className="grid grid-cols-4">
      {imgList.map((data, index) => (
        <div key={index} style={{ cursor: "pointer" }} className="relative w-full border border-transparent" onClick={() => handleOnClick(data)}>
          <Img src={data.image.replace('thumbnail', 'large')} style={{ height: "93.75px", width: "93.75px"}} />
        </div>
      ))}
    </section>
  )
}

export default SmallBanner