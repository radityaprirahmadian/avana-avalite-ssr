import React, { useState, useCallback, useEffect } from "react";

import shops from 'src/constants/api/shops';
import ImgSlider from 'src/components/ImgSlider';

export default function Sliders({
  setSelectedCategory,
}) {
  const [sliderList, setSliderList] = useState({
    data: [],
    isLoading: false,
    errors: [],
  });

  const getSlider = useCallback(
    () => {
      setSliderList({
        isLoading: true,
        data: null,
        errors: []
      })
      shops.sliders()
        .then((data) => {
          setSliderList({
            isLoading: false,
            data: data,
            error: []
          })
          console.log(data)
        });
    },
    []
  );

  const selectSlider = useCallback(
    (data) => {
      const urlCategoryId = data.url.includes("/category/")
        ? data.url.split("/category/")[1]
        : ""
      if (urlCategoryId) {
        setSelectedCategory(Number(urlCategoryId));
      }
    },
    []
  );

  useEffect(
    () => {
      getSlider();
    },
    []
  );

  return (
    <>
      {
        sliderList.isLoading ? (
          <div className="w-auto py-2">
            <div className="h-32 loading rounded"></div>
          </div>
        ) : sliderList.data.length ? (
          <section
            style={{  
              margin: '1rem 0',
              position: 'relative',
              width: '100%',
              paddingTop: '40%',
            }}
          >
            <ImgSlider
              imgKey="image"
              images={sliderList.data || []}
              onClick={selectSlider}
            />
          </section>
        ) : null
      }
    </>
  )
}