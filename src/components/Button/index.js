import { Button, CircularProgress } from '@material-ui/core';


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