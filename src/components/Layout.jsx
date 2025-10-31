// src/components/Layout.jsx
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="app-layout">
      <nav style={{ background: '#eee', padding: '1rem' }}>
        {/* ✅ 修改为 /dashboard */}
        <Link to="/dashboard" style={{ marginRight: '1rem' }}>我的知识点</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>登录</Link>
        <Link to="/register">注册</Link>
      </nav>
      
      <main style={{ padding: '1rem' }}>
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;