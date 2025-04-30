import React from 'react';

export const Avatar = ({ children, className }) => (
  <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 h-10 w-10 ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`rounded-full h-full w-full object-cover ${className}`} />
);

export const AvatarFallback = ({ children, className }) => (
  <div className={`flex items-center justify-center h-full w-full text-gray-600 ${className}`}>
    {children}
  </div>
);