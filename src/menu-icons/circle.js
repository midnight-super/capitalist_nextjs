import React from 'react';

const CircleSvg = ({ color }) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10.1729" cy="10" r="10" fill={color || '#BE80CC'} />
    </svg>
  );
};
export default CircleSvg;
