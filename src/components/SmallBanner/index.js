import { useEffect, useState } from 'react'

const SmallBanner = () => {
  // Imitate API call
  const [bannerList, setBannerList] = useState([])
  useEffect(() => {
    setBannerList([1, 2, 3, 4, 5, 6, 7, 8])
  }, [])
  
  return (
    <section className="grid grid-cols-4">
      {bannerList.map((data, index) => (
        <div key={index} className="relative w-full border border-transparent">
          <h2 style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} className="absolute z-10 text-white text-3xl">{data}</h2>
          <img src={`https://picsum.photos/id/${data}/200/200`} className="h-full w-full opacity-75" />
        </div>
      ))}
    </section>
  )
}

export default SmallBanner