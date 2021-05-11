import React, { useState, useCallback } from 'react';
import images from 'src/constants/images';

const Image = (props) => {
  const [state, setState] = useState({
    isLoading: true,
  });

  const handleLoadEvent = useCallback((e) => {
    setState({
      isLoading: false
    });
  }, []);

  const handleErrorEvent = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = props.placeholder || images.placeholder;
    setState({
      isLoading: false
    });
  }, []);

  return (
    <img
      className={`w-full h-full object-cover ${props.className} ${state.isLoading ? 'loading' : ''}`}
      src={props.src}
      alt={props.alt}
      style={props.style}
      onLoad={handleLoadEvent}
      onError={handleErrorEvent}
    />
  )
}

export default Image;
