import SlickSlider from 'src/components/SlickSlider'

import React, { useState, useCallback, useEffect } from 'react'

import shops from 'src/constants/api/shops'
import SmallBanner from 'src/components/SmallBanner'

const SlidersWithSlick = ({ setSelectedCategory, setSelectedCollection }) => {
   const [sliderList, setSliderList] = useState({
      data: [],
      isLoading: false,
      errors: [],
   })

   const getSlider = useCallback(() => {
      setSliderList({
         isLoading: true,
         data: null,
         errors: [],
      })
      shops.sliders().then((data) => {
         setSliderList({
            isLoading: false,
            data: data,
            error: [],
         })
      })
   }, [])

   /**
    * This function is used to select the banner images
    * @param {Object} data - The selected slider object
    */
   const selectSlider = useCallback((data) => {
      const urlCategoryId = data?.url?.includes('/category/')
         ? data.url.split('/category/')[1]
         : ''
      const urlCollectionId = data?.url?.includes('/collection/')
         ? data.url.split('/collection/')[1]
         : ''
      if (urlCategoryId) {
         setSelectedCategory(String(urlCategoryId))
         setSelectedCollection("")
      }
      if (urlCollectionId) {
         setSelectedCollection(String(urlCollectionId))
         setSelectedCategory("")
      }
   }, [])

   useEffect(() => {
      getSlider()
   }, [])

   return sliderList.isLoading ? (
            <div className="w-auto py-2">
               <div className="h-32 loading rounded"></div>
            </div>
         ) : (
            <>
            <SlickSlider
               imgKey="image"
               images={sliderList.data || []}
               onClick={selectSlider}
            />
            <SmallBanner
               imgKey="image"
               images={sliderList.data || []}
               onClick={selectSlider}
            />
            </>
         )
}

export default SlidersWithSlick
