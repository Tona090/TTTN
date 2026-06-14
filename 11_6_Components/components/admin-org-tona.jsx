import React from 'react';

const AdminOrg = ({ title, columns = [], background = {} }) => {
  const sectionStyle = {
    padding: '80px 20px',
    background: background.type === 'gradient' 
      ? `linear-gradient(to bottom, #f0f4ff, #e0e7ff)` 
      : '#fff',
    minHeight: '600px'
  };

  return (
    <section style={sectionStyle}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        display: 'grid', 
        // Tự động chia cột dựa trên số lượng item (2, 3 hoặc 4 cột)
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`, 
        gap: '30px' 
      }}>
        {columns.map((col, idx) => (
          <div key={idx} style={{
            background: '#fff',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#002b5b', marginBottom: '20px', textTransform: 'uppercase' }}>
              {col.title}
            </h3>

            {/* Nếu là khối văn bản */}
            {col.type === 'text' && (
              <div>
                <p style={{ color: '#444', lineHeight: '1.8', fontSize: '15px', marginBottom: '20px' }}>
                  {col.description}
                </p>
                {col.image && <img src={col.image} style={{ width: '100%', borderRadius: '10px', marginTop: 'auto' }} alt="info" />}
              </div>
            )}

            {/* Nếu là khối danh sách nhân sự (Duyệt mảng con) */}
            {col.type === 'people' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(col.members || []).map((person, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                    <img src={person.avatar || 'https://via.placeholder.com/60'} 
                         style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} 
                         alt={person.name} />
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>Họ tên: {person.name}</div>
                      <div style={{ color: '#666' }}>Chức vụ CLB: {person.role}</div>
                      <div style={{ color: '#666' }}>Doanh nghiệp: {person.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminOrg;