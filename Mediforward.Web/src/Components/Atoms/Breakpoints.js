import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const breakpoints = [577, 769, 1025, 1337];

const windowSize = w => {
  if (!w) return 'lg';
  let wSize = null;
  if (w < breakpoints[0]) {
    wSize = 'xs';
  } else if (w < breakpoints[1]) {
    wSize = 'sm';
  } else if (w < breakpoints[2]) {
    wSize = 'md';
  } else {
    wSize = 'lg';
  }
  return wSize;
};

export const useBreakpoints = () => {
  const [size, setSize] = useState(null);
  useEffect(() => {
    let winSize = windowSize(window.innerWidth);
    setSize(winSize);
    const handleResize = () => {
      winSize = windowSize(window.innerWidth);
      if (size !== winSize) {
        setSize(winSize);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return { breakSize: size };
};

const Breakpoints = ({ children, ...extra }) => {
  const { breakSize } = useBreakpoints();
  return <>{extra[breakSize || 'lg'] && children}</>;
};

Breakpoints.defaultProps = {
  xs: false,
  sm: false,
  md: false,
  lg: false
};

Breakpoints.propTypes = {
  children: PropTypes.node.isRequired,
  xs: PropTypes.bool,
  sm: PropTypes.bool,
  md: PropTypes.bool,
  lg: PropTypes.bool
};

export default Breakpoints;
