import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Badge as BadgeMui } from '@material-ui/core'

export default function Badge() {
  return BadgeStyle
}

export function BadgeDiscount(props) {
  const BadgeStyle = withStyles(() => ({
    anchorOriginTopRightRectangle: {
      top: '5.75px',
      right: '5.75px',
   },
  }))(BadgeMui)

  return (
    <BadgeStyle
      badgeContent={props.content}
      color="error"
    >
      {props.children}
    </BadgeStyle>
  )
}

export function BadgeProductCount(props) {
  const BadgeStyle = withStyles(() => ({
    anchorOriginBottomRightRectangle: {
      bottom: '16px',
      right: props.styleBadge.right,
      backgroundColor: '#0065FF',
      color: '#FFFFFF'
    },
  }))(BadgeMui)

  return (
    <BadgeStyle
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom'
      }}
      color="primary"
      badgeContent={props.content}
      style={{
        ...props.style
      }}
    >
      {props.children}
    </BadgeStyle>
  )
}