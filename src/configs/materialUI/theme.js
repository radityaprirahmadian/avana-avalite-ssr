import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#FDB814',
      },
      secondary: {
         main: '#19857b',
      },
      error: {
         main: red.A400,
      },
      background: {
         default: '#fff',
      },
      whatsapp: {
         main: '#128C7E',
         backgroundColor: '#128C7E',
         color: '#FFFFFF'
      }
   },
   overrides: {
      MuiButton: {
         root: {
            fontFamily: 'Montserrat',
            fontWeight: '700',
            fontSize: '14px',
            borderRadius: '8px'
         },
         // containedPrimary: {
         //    color: '#1A1A1A'
         // }
      },
      MuiTab: {
         root: {
            fontFamily: 'Montserrat',
            minWidth: 'fit-content',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1A1A1A',
         },
         textColorPrimary: {
            color: '#1A1A1A',
            '&.Mui-selected': {
               color: '#1A1A1A',
            }
         },
      },
      MuiBadge: {
         anchorOriginTopRightRectangle: {
            top: '5.75px',
            right: '5.75px',
         },
         // anchorOriginBottomRightRectangle: {
            
         // }
      }
   },
   props: {
      MuiTab: {
         selected:{
            color: '#1A1A1A',
         }
      }
   }
})

export default theme
