import React from 'react';

const BoxSvg = ({ color, height, width }) => {
  return (
    <svg
      width={width || '28'}
      height={height || '28'}
      viewBox={height && width ? `0 0 ${height} ${width}` : '0 0 28 28'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width={width || '28'}
        height={height || '28'}
        rx="4"
        fill={color || '#FFDBA8'}
      />
    </svg>
  );
};
export default BoxSvg;
