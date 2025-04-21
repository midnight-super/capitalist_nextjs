import React from 'react';

const BoxFileSvg = ({ color, height, width }) => {
  return (
    <svg
      width={width || '22'}
      height={height || '22'}
      viewBox={height && width ? `0 0 ${height} ${width}` : '0 0 22 22'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width={width || '22'}
        height={height || '22'}
        rx="4"
        fill={color || '#0B162A'}
      />
    </svg>
  );
};
export default BoxFileSvg;
