'use client';

import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

type LinhKien = {
  id: string;
  danhMuc: string;
  ten: string;
  gia: number;
  cuaHang?: string;
  url?: string;
  trangThai?: 'Còn hàng' | 'Hết hàng' | 'Không rõ';
};

const danhMucList = [
  'CPU',
  'GPU',
  'Bộ nhớ',
  'Ổ lưu trữ',
  'Bo mạch chủ',
  'Nguồn điện',
  'Vỏ máy',
  'Tản nhiệt',
  'Màn hình',
  'Hệ điều hành',
];

export default function DanhSachLinhKien() {
  const [linhKienList, setLinhKienList] = useState<LinhKien[]>([]);

  const tongGia = linhKienList.reduce((sum, p) => sum + p.gia, 0);

  function themLinhKien(danhMuc: string) {
    const moi: LinhKien = {
      id: `${danhMuc.toLowerCase()}-${Date.now()}`,
      danhMuc,
      ten: `Ví dụ linh kiện ${danhMuc} có tên khá dài để kiểm tra hiển thị`,
      gia: Math.floor(Math.random() * 300) + 50,
      cuaHang: 'Cửa hàng ví dụ',
      url: '',
      trangThai: 'Còn hàng',
    };
    setLinhKienList([...linhKienList, moi]);
  }

  function xoaLinhKien(id: string) {
    setLinhKienList(linhKienList.filter((p) => p.id !== id));
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8"
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: 14,
        color: '#222',
      }}
    >
      <div
        className="overflow-x-auto rounded-md"
        style={{
          border: '1px solid #dfe3e8',
          backgroundColor: 'white',
        }}
      >
        {/* Tiêu đề bảng */}
        <div
          className="hidden md:flex select-none"
          style={{
            backgroundColor: '#f6f8fa',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#6b6b6b',
            userSelect: 'none',
          }}
        >
          <div style={{ width: 190, padding: '14px 20px' }}>Danh mục</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>Tên linh kiện</div>
          <div style={{ width: 160, padding: '14px 20px' }}>Cửa hàng</div>
          <div
            style={{
              width: 110,
              padding: '14px 20px',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Giá
          </div>
          <div style={{ width: 110, padding: '14px 20px', textAlign: 'center' }}>
            Trạng thái
          </div>
          <div style={{ width: 130, padding: '14px 20px', textAlign: 'center' }}>
            Hành động
          </div>
        </div>

        {/* Các hàng dữ liệu */}
        {danhMucList.map((danhMuc) => {
          const linhKien = linhKienList.find((p) => p.danhMuc === danhMuc);
          if (linhKien) {
            return (
              <div
                key={linhKien.id}
                className="flex cursor-pointer"
                style={{
                  borderTop: '1px solid #dfe3e8',
                  padding: '14px 20px',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}
              >
                <div
                  style={{
                    width: 190,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 600,
                    color: '#222',
                  }}
                >
                  {linhKien.danhMuc}
                </div>
                <div
                  style={{
                    flex: 1,
                    color: '#0071e3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={linhKien.ten}
                >
                  {linhKien.url ? (
                    <a
                      href={linhKien.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0071e3', textDecoration: 'none' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = 'underline')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = 'none')
                      }
                    >
                      {linhKien.ten}
                    </a>
                  ) : (
                    linhKien.ten
                  )}
                </div>
                <div
                  style={{
                    width: 160,
                    color: '#444',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {linhKien.cuaHang ?? '-'}
                </div>
                <div
                  style={{
                    width: 110,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#222',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${linhKien.gia.toFixed(2)}
                </div>
                <div
                  style={{
                    width: 110,
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        linhKien.trangThai === 'Còn hàng'
                          ? '#dbf3db'
                          : linhKien.trangThai === 'Hết hàng'
                          ? '#f7d7d7'
                          : '#e8e8e8',
                      color:
                        linhKien.trangThai === 'Còn hàng'
                          ? '#2f7f2f'
                          : linhKien.trangThai === 'Hết hàng'
                          ? '#a33a3a'
                          : '#777777',
                      borderRadius: 12,
                      padding: '2px 8px',
                      fontWeight: 500,
                      fontSize: 12,
                      display: 'inline-block',
                      userSelect: 'none',
                    }}
                  >
                    {linhKien.trangThai ?? 'Không rõ'}
                  </span>
                </div>
                <div
                  style={{
                    width: 130,
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 20,
                  }}
                >
                  <button
                    onClick={() => alert('Tính năng chỉnh sửa sắp ra mắt!')}
                    aria-label="Chỉnh sửa linh kiện"
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#0071e3',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#e6f0ff')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => xoaLinhKien(linhKien.id)}
                    aria-label="Xóa linh kiện"
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#d33',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#ffe6e6')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          }

          // Khi chưa chọn linh kiện
          return (
            <div
              key={danhMuc}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderTop: '1px solid #dfe3e8',
                padding: '20px',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: 190,
                  fontWeight: 600,
                  color: '#4a4a4a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {danhMuc}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <button
                  type="button"
                  onClick={() => themLinhKien(danhMuc)}
                  style={{
                    border: '1px solid #0071e3',
                    color: '#0071e3',
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                    padding: '0 18px',
                    height: 38,
                    lineHeight: '38px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: 14,
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#e6f0ff')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  + Thêm linh kiện
                </button>
              </div>
              <div style={{ width: 160 }}></div>
              <div style={{ width: 110 }}></div>
              <div style={{ width: 110 }}></div>
              <div style={{ width: 130 }}></div>
            </div>
          );
        })}

        {/* Tổng cộng */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            fontWeight: 700,
            color: '#222',
            padding: '14px 20px',
            borderTop: '1px solid #dfe3e8',
            userSelect: 'none',
          }}
        >
          <div style={{ width: 190 }}>Tổng cộng</div>
          <div style={{ flex: 1 }}></div>
          <div style={{ width: 160 }}></div>
          <div
            style={{
              width: 110,
              textAlign: 'right',
              fontFamily: 'monospace',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${tongGia.toFixed(2)}
          </div>
          <div style={{ width: 110 }}></div>
          <div style={{ width: 130 }}></div>
        </div>
      </div>
    </div>
  );
}
