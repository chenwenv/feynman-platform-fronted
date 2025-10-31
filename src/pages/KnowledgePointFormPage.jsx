// src/pages/KnowledgePointFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

function KnowledgePointFormPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id: idParam } = useParams(); // 路由参数是字符串
  const navigate = useNavigate();

  // ✅ 转为整数 ID
  const numericId = idParam ? parseInt(idParam, 10) : null;
  const isEditing = !isNaN(numericId) && numericId !== null;

  // 编辑时加载数据
  useEffect(() => {
    if (isEditing) {
      const fetchKP = async () => {
        try {
          // ✅ 使用整数 ID 请求
          const res = await apiClient.get(`/knowledge-points/${numericId}`);
          setTitle(res.data.title);
          setContent(res.data.content);
        } catch (err) {
          console.error('加载失败', err);
          alert('无法加载知识点');
          navigate('/dashboard');
        }
      };
      fetchKP();
    }
  }, [numericId, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const kpData = { title, content };

    try {
      if (isEditing) {
        // ✅ 使用整数 ID
        await apiClient.put(`/knowledge-points/${numericId}`, kpData);
      } else {
        await apiClient.post('/knowledge-points', kpData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('保存失败', error);
      alert('保存失败，请重试');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>{isEditing ? '编辑知识点' : '新建知识点'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">标题:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="content">内容 (支持 Markdown 和 LaTeX):</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            required
            placeholder={`例如：
这是一个行内公式: $E = mc^2$

这是一个块级公式:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$`}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: '1.5rem',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isEditing ? '更新' : '创建'}
        </button>
      </form>
    </div>
  );
}

export default KnowledgePointFormPage;