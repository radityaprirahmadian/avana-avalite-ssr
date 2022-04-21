import React from 'react'

import { Tabs, Tab } from '@material-ui/core'

export default function CategoriesSelection(props) {
   const tabList = [
      {
         id: '',
         label: props.lang?.text__all || 'All',
      },
   ]

   props.categories.data?.flat?.forEach?.((item) => {
      tabList.push({
         id: item.id,
         label: item.name,
      })
   })

   if (props.categories.status === 'loading')
      return (
         <div className="my-2">
            <div className="loading inline-block mr-2 h-6 w-12"></div>
            <div className="loading inline-block mr-2 h-6 w-24"></div>
            <div className="loading inline-block mr-2 h-6 w-22"></div>
            <div className="loading inline-block mr-2 h-6 w-16"></div>
         </div>
      )

   return (
      <div
         className="sticky bg-white pb-2 z-10"
         style={{
            top: '5.25rem'
         }}
      >
         <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={props.selectedCategory}
            variant="scrollable"
            aria-label="product category"
            scrollButtons="off"
         >
            {tabList.map((tab) => (
               <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  onClick={() => props.setSelectedCategory(tab.id)}
                  disableRipple
                  style={{
                     minWidth: 'fit-content',
                     fontSize: '.75rem'
                  }}
                  {...{
                     "aria-label": `category-${tab.label}`
                  }}
               />
            ))}
         </Tabs>
      </div>
   )
}
