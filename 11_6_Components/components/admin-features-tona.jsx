import React from 'react';

const AdminFeatures = ({ 
  title = "CÁC BAN CHUYÊN MÔN", 
  subtitle = "CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH",
  background = {}, 
  items = [] 
}) => {
  
  // 1. Xử lý Style cho Nền toàn bộ section
  const sectionStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: background.type === 'color' ? background.color : '#f8faff',
    backgroundImage: background.type === 'image' ? `url(${background.url})` : 'none',
    backgroundSize: 'cover'
  };

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Tiêu đề chính */}
        <h2 style={{ color: '#003366', fontWeight: 'bold', fontSize: '24px' }}>{title}</h2>
        <p style={{ color: '#003366', marginBottom: '40px', fontSize: '14px' }}>{subtitle}</p>

        {/* Danh sách các "Cục" (Items) */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '20px' 
        }}>
          {items.map((item, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #1e90ff 0%, #0056b3 100%)',
              width: '300px',
              padding: '30px',
              borderRadius: '20px 80px 20px 20px', // Bo góc đặc trưng như hình mẫu
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              {/* Icon */}
              {item.icon && <img src={item.icon} alt="icon" style={{ width: '50px', marginBottom: '15px' }} />}
              
              {/* Tên Ban */}
              <h3 style={{ fontSize: '18px', marginBottom: '20px', minHeight: '50px' }}>{item.label}</h3>
              
              {/* Nút bấm trong mỗi cục */}
              <button style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid #fff',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: `${item.btnBorderRadius || 20}px`,
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                {item.btnText || "Xem hoạt động"} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminFeatures;