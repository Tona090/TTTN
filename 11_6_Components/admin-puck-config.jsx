import React from 'react';
import AdminHeading from './components/admin-heading';
import AdminText from './components/admin-text';
import AdminImage from './components/admin-image';
import AdminSection from './components/admin-section';
import AdminHero from './components/admin-hero';

// Import cac components bai tap
import AdminHeroPro from './components/admin-hero-tona';
import AdminFeatures from './components/admin-features-tona';
import AdminOrg from './components/admin-org-tona';

export const puckConfig = {
  components: {
    Heading: {
      label: 'Tiêu đề',
      fields: {
        content: { type: 'text', label: 'Nội dung', contentEditable: true },
        level: {
          type: 'select', label: 'Cấp độ',
          options: [
            { label: 'H1', value: 1 }, { label: 'H2', value: 2 },
            { label: 'H3', value: 3 }, { label: 'H4', value: 4 },
            { label: 'H5', value: 5 }, { label: 'H6', value: 6 }
          ]
        },
        align: {
          type: 'select', label: 'Căn lề',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' }
          ]
        }
      },
      defaultProps: { content: 'Tiêu đề', level: 2, align: 'left' },
      render: (props) => <AdminHeading {...props} />
    },

    Text: {
      label: 'Văn bản',
      fields: {
        content: { type: 'textarea', label: 'Nội dung', contentEditable: true },
        align: {
          type: 'select', label: 'Căn lề',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' },
            { label: 'Đều', value: 'justify' }
          ]
        }
      },
      defaultProps: { content: 'Nhập văn bản ở đây...', align: 'left' },
      render: (props) => <AdminText {...props} />
    },

    Image: {
      label: 'Ảnh',
      fields: {
        src: { type: 'text', label: 'URL ảnh' },
        alt: { type: 'text', label: 'Alt text' },
        width: { type: 'text', label: 'Chiều rộng', default: '100%' },
        height: { type: 'text', label: 'Chiều cao', default: 'auto' },
        borderRadius: { type: 'text', label: 'Bo góc', default: '0' },
        align: {
          type: 'select', label: 'Căn lề',
          options: [
            { label: 'Trái', value: 'left' },
            { label: 'Giữa', value: 'center' },
            { label: 'Phải', value: 'right' }
          ]
        }
      },
      defaultProps: {
        src: 'https://via.placeholder.com/800x400',
        alt: 'Ảnh minh họa',
        width: '100%', height: 'auto', borderRadius: '0', align: 'center'
      },
      render: (props) => <AdminImage {...props} />
    },

    Section: {
      label: 'Khoảng (Section)',
      fields: {
        container: {
          type: 'select', label: 'Chiều rộng',
          options: [
            { label: 'Small (640px)', value: 'sm' },
            { label: 'Medium (768px)', value: 'md' },
            { label: 'Large (1024px)', value: 'lg' },
            { label: 'XL (1280px)', value: 'xl' }
          ]
        },
        background: {
          type: 'object', label: 'Background',
          objectFields: {
            type: {
              type: 'select', label: 'Loại',
              options: [
                { label: 'Màu', value: 'color' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Ảnh', value: 'image' }
              ]
            },
            color: { type: 'text', label: 'Màu nền', default: '#ffffff' },
            fromColor: { type: 'text', label: 'Gradient từ', default: '#667eea' },
            toColor: { type: 'text', label: 'Gradient đến', default: '#764ba2' },
            direction: { type: 'text', label: 'Hướng gradient', default: 'to right' },
            bg_image: { type: 'text', label: 'URL ảnh nền' },
            opacity: { type: 'number', label: 'Độ mờ', min: 0, max: 1, step: 0.1, default: 1 }
          }
        },
        padding_x: { type: 'number', label: 'Padding ngang', min: 0, max: 16, default: 4 },
        padding_y: { type: 'number', label: 'Padding dọc', min: 0, max: 16, default: 4 },
        content: { type: 'slot' }
      },
      defaultProps: {
        container: 'lg',
        background: { type: 'color', color: '#ffffff' },
        padding_x: 4, padding_y: 4,
        content: []
      },
      render: (props) => <AdminSection {...props} />
    },

    HeroPro: {
      label: 'Hero Sen Hồng',
      fields: {
        title: { type: 'text', label: 'Tiêu đề' },
        description: { type: 'textarea', label: 'Mô tả' },
        background: {
          type: 'object',
          label: 'Nền banner',
          objectFields: {
            type: { type: 'select', label: 'Loại nền', options: [{ label: 'Màu', value: 'color' }, { label: 'Ảnh', value: 'image' }] },
            color: { type: 'text', label: 'Màu nền' },
            url: { type: 'text', label: 'Link ảnh/GIF' }
          }
        },
        contentBox: {
          type: 'object',
          label: 'Tùy chỉnh khối nội dung',
          objectFields: {
            align: { type: 'select', label: 'Vị trí', options: [{ label: 'Trái', value: 'left' }, { label: 'Giữa', value: 'center' }, { label: 'Phải', value: 'right' }] },
            bgColor: { type: 'text', label: 'Màu nền khối' },
            textColor: { type: 'text', label: 'Màu chữ' },
            borderRadius: { type: 'number', label: 'Bo góc khối' }
          }
        },
        button: {
          type: 'object',
          label: 'Tùy chỉnh nút',
          objectFields: {
            text: { type: 'text', label: 'Chữ trên nút' },
            color: { type: 'text', label: 'Màu nút' },
            borderRadius: { type: 'number', label: 'Bo góc nút' },
            fontSize: { type: 'number', label: 'Cỡ chữ nút' }
          }
        }
      },
      defaultProps: {
        title: "Sen Hồng",
        description: "CLB Doanh nhân Đồng Tháp...",
        background: { type: 'image', url: 'https://via.placeholder.com/1600x900' },
        contentBox: { align: 'left', borderRadius: 20 },
        button: { text: "Tham gia cộng đồng", borderRadius: 50 }
      },
      render: (props) => <AdminHeroPro {...props} />
    },

    Features: {
      label: 'Các Ban Chuyên Môn',
      fields: {
        title: { type: 'text', label: 'Tiêu đề lớn' },
        subtitle: { type: 'text', label: 'Tiêu đề nhỏ' },
        background: {
          type: 'object',
          label: 'Nền Section',
          objectFields: {
            type: { type: 'select', label: 'Loại nền', options: [{ label: 'Màu', value: 'color' }, { label: 'Ảnh', value: 'image' }] },
            color: { type: 'text', label: 'Màu nền' },
            url: { type: 'text', label: 'Link ảnh nền' }
          }
        },
        items: {
          type: 'array',
          label: 'Danh sách các Ban',
          arrayFields: {
            label: { type: 'text', label: 'Tên Ban' },
            icon: { type: 'text', label: 'Link Icon (PNG/SVG)' },
            btnText: { type: 'text', label: 'Chữ trên nút' },
            btnBorderRadius: { type: 'number', label: 'Bo góc nút' }
          },
          getItemSummary: (item) => item.label || "Tên ban chuyên môn"
        }
      },
      defaultProps: {
        title: "CÁC BAN CHUYÊN MÔN",
        subtitle: "CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH",
        items: [
          { label: "Ban Kinh tế - Đầu tư", btnText: "Xem hoạt động", btnBorderRadius: 20 },
          { label: "Ban Văn hóa - Thể thao", btnText: "Xem hoạt động", btnBorderRadius: 20 },
          { label: "Ban Xã hội - Cộng đồng", btnText: "Xem hoạt động", btnBorderRadius: 20 }
        ]
      },
      render: (props) => <AdminFeatures {...props} />
    },

    Organization: {
      label: 'Giới thiệu & Nhân sự',
      fields: {
        background: {
          type: 'object',
          label: 'Nền',
          objectFields: {
            type: { type: 'select', label: 'Loại nền', options: [{ label: 'Trắng', value: 'white' }, { label: 'Gradient', value: 'gradient' }] }
          }
        },
        columns: {
          type: 'array',
          label: 'Danh sách các Khối (Cột)',
          getItemSummary: (item) => item.title || "Khối nội dung",
          arrayFields: {
            title: { type: 'text', label: 'Tiêu đề khối' },
            type: {
              type: 'select',
              label: 'Loại nội dung',
              options: [
                { label: 'Đoạn văn bản', value: 'text' },
                { label: 'Danh sách nhân sự', value: 'people' }
              ]
            },
            description: { type: 'textarea', label: 'Nội dung văn bản' },
            image: { type: 'text', label: 'Link ảnh minh họa' },
            members: {
              type: 'array',
              label: 'Danh sách nhân sự',
              getItemSummary: (item) => item.name || "Nhân viên",
              arrayFields: {
                name: { type: 'text', label: 'Tên' },
                role: { type: 'text', label: 'Chức vụ' },
                company: { type: 'text', label: 'Công ty' },
                avatar: { type: 'text', label: 'Link ảnh đại diện' }
              }
            }
          }
        }
      },
      defaultProps: {
        background: { type: 'white' },
        columns: [
          { title: "VỀ CÂU LẠC BỘ", type: 'text', description: "CLB Doanh nhân Đồng Tháp là nơi hội tụ..." },
          { title: "CƠ CẤU TỔ CHỨC", type: 'people', members: [ { name: "Trần Văn Khang", role: "Ủy viên BCH", company: "Công ty Logistics" } ] }
        ]
      },
      render: (props) => <AdminOrg {...props} />
    }

  // Sidebar categories
  categoryGroups: [
    { title: 'Cơ bản', components: ['Heading', 'Text', 'Image'] },
    { title: 'Layout', components: ['Section'] },
    { title: 'Nâng cao', components: ['HeroPro', 'Features', 'Organization'] } 
  ],

  // Root config
  root: {
    render: ({ children }) => (
      <div className="min-h-screen">{children}</div>
    )
  }
};

export default puckConfig;