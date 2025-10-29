// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout'; // 引入Layout
import ProtectedRoute from './components/ProtectedRoute'; // 引入

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> {/* Layout作为父路由 */}
        {/* 公共路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 受保护的路由 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          {/* 未来其他的受保护页面也可以放在这里 */}
        </Route>
      </Route>
    </Routes>
  );
}
export default App;