import React from 'react'
import { Tabs, Tab, TabScrollButton } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

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
         className="sticky bg-white pb-2 z-30"
         style={{
            top: '5.25rem',
         }}
      >
         <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={props.selectedCategory}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="product category"
            ScrollButtonComponent={CustomTabScrollButton}
         >
            {tabList.map((tab) => (
               <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  onClick={() => {
                     props.setSelectedCategory(tab.id)
                     props.setSelectedCollection('')
                  }}
                  disableRipple
                  style={{
                     minWidth: 'fit-content',
                     fontSize: '.75rem',
                     padding: '0 1rem',
                  }}
                  {...{
                     'aria-label': `category-${tab.label}`,
                  }}
               />
            ))}
         </Tabs>
      </div>
   )
}

/**
 * Custom Tab Scroll Button with Custom Icon and Color
 * @param {ScrollButtonComponent} props
 */
const CustomTabScrollButton = (props) => {
   const { direction, disabled } = props

   return (
      <TabScrollButton
         style={{
            backgroundColor: '#FDB814',
            width: '48px',
            height: '48px',
            boxShadow:
               direction === 'left'
                  ? '4px 0px 4px rgba(0, 0, 0, 0.25)'
                  : '-4px 0px 4px rgba(0, 0, 0, 0.25)',
            display: disabled ? 'none' : '',
            zIndex: 1,
            position: 'absolute',
            top: '0',
            right: direction === 'right' && '0',
            left: direction === 'left' && '0',
            opacity: '1',
         }}
         children={
            <ArrowBack
               style={{
                  transform: direction === 'left' ? 'rotate(180deg)' : '',
               }}
            />
         }
         {...props}
      />
   )
}
