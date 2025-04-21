import React from 'react';

const FolderSvg = ({ color }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1_1283)">
        <path
          d="M16.667 5.01042H10.0003L8.33366 3.34375H3.33366C2.41699 3.34375 1.67533 4.09375 1.67533 5.01042L1.66699 15.0104C1.66699 15.9271 2.41699 16.6771 3.33366 16.6771H16.667C17.5837 16.6771 18.3337 15.9271 18.3337 15.0104V6.67708C18.3337 5.76042 17.5837 5.01042 16.667 5.01042ZM16.667 15.0104H3.33366V6.67708H16.667V15.0104Z"
          fill={color || '#7C7C7C'}
        />
      </g>
      <defs>
        <clipPath id="clip0_1_1283">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default FolderSvg;
