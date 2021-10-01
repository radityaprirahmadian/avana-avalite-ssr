import { Button, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { WhatsApp } from '@material-ui/icons'

const WaButtonStyle = withStyles({
  root: {
    color: 'white',
    backgroundColor: '#128c7e',
    '&:hover': {
      color: 'white',
      backgroundColor: '#128c7e',
    },
  },
})(Button);


export default function Buttons(props) {
  return (
    <>
      <Button
        {...props}
        disabled={
          props.loading || props.disabled
        }
        fullWidth
      >
        {props.loading ? (
            <CircularProgress size={20} />
          ) : (
            props.children
          )
        }
      </Button>
    </>
  )
}

export function WhatsappButton(props) {
  return (
    <>
      <WaButtonStyle
        className={props.className}
        variant="contained"
        disableElevation
        startIcon={props.loading || <WhatsApp />}
        disabled={
          props.loading || props.disabled
        }
        onClick={props.onClick}
        fullWidth
      >
        {props.loading ? (
            <CircularProgress size={20} />
          ) : (
            props.children
          )
        }
      </WaButtonStyle>
    </>
  )
}