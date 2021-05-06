export default function (props) {
  return (
    <div className={`spinner ${props.className}`} style={{
      transform: `scale(${props.size})`,
      ...props.style
    }}>
      {
        Array(3)
          .fill()
          .map((val, idx) => (
            <div
              key={idx}
              style={{
                borderTopColor: props.color ?? '#FCB712',
                borderLeftColor: props.color ?? '#FCB712'
              }}
            />
          ))
      }
    </div>
  )
}