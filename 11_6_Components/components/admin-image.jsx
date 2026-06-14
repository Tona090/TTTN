import React from 'react';

// Image component — render ảnh với URL, width, height, align.
const AdminImage = ({ src, alt, width = '100%', height = 'auto', borderRadius = '0', align = 'center' }) => {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto';
  return (
    <div className={`p-4 ${alignClass}`} style={{ maxWidth: width }}>
      <img
        src={src || 'https://via.placeholder.com/800x400'}
        alt={alt || 'Ảnh minh họa'}
        style={{ width: '100%', height, borderRadius }}
        className="object-cover"
      />
    </div>
  );
};

export default AdminImage;
