import React from 'react';

// Text component — render đoạn văn bản.
const AdminText = ({ content, align = 'left' }) => {
  return <p style={{ textAlign: align }} className="whitespace-pre-wrap">{content}</p>;
};

export default AdminText;
