import mysql from 'mysql2/promise';

/**
 * Cấu hình kết nối MySQL Pool cho Express Backend
 * Bạn chỉ cần cài đặt thư viện: npm install mysql2
 * Và cấu hình các thông số môi trường trong file .env
 */
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'techgear_db',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hàm kiểm tra kết nối Database
export async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối MySQL Database thành công!');
    connection.release();
  } catch (error) {
    console.error('❌ Thất bại kết nối MySQL Database:', error);
  }
}
