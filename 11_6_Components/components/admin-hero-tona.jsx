import React from 'react';

const AdminHeroPro = ({
    background = {},
    contentBox = {},
    title = "",
    description = "",
    button = {}
}) => {
    // 1. Xử lý Style cho Nền
    const bgStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '80px 20px',
        minHeight: '500px',
        justifyContent: contentBox.align === 'right' ? 'flex-end' : contentBox.align === 'center' ? 'center' : 'flex-start',
    };

    if (background.type === 'image') {
        bgStyle.backgroundImage = `url(${background.url})`;
        bgStyle.backgroundSize = 'cover';
        bgStyle.backgroundPosition = 'center';
    } else {
        bgStyle.backgroundColor = background.color || '#f0f0f0';
    }

    // 2. Style cho Cụm nội dung (Sen Hồng)
    const boxStyle = {
        backgroundColor: contentBox.bgColor || 'rgba(255, 255, 255, 0.8)',
        padding: '40px',
        borderRadius: `${contentBox.borderRadius || 20}px`,
        maxWidth: '500px',
        color: contentBox.textColor || '#000',
        backdropFilter: 'blur(10px)'
    };

    // 3. Style cho Nút
    const btnStyle = {
        backgroundColor: button.color || '#007bff',
        color: button.textColor || '#fff',
        padding: '10px 25px',
        borderRadius: `${button.borderRadius || 5}px`,
        border: 'none',
        cursor: 'pointer',
        marginTop: '20px',
        fontSize: `${button.fontSize || 16}px`
    };

    return (
        <div style={bgStyle}>
            <div style={boxStyle}>
                <h2 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '15px' }}>{title}</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{description}</p>
                <button style={btnStyle}>{button.text || "Xem thêm"}</button>
            </div>
        </div>
    );
};

export default AdminHeroPro;