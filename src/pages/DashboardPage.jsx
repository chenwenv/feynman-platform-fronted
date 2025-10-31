// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import mermaid from 'mermaid';

function DashboardPage() {
  const [knowledgePoints, setKnowledgePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 初始化 Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      logLevel: 'warn',
    });
  }, []);

  useEffect(() => {
    const fetchKPs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/knowledge-points');
        setKnowledgePoints(res.data);
      } catch (err) {
        setError('获取知识点失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('确定删除？')) {
      try {
        await apiClient.delete(`/knowledge-points/${id}`);
        setKnowledgePoints((prev) => prev.filter((kp) => kp.id !== id));
      } catch (err) {
        console.error('删除失败', err);
        alert('删除失败');
      }
    }
  };

  // 处理 Mermaid 代码块
  const MermaidComponent = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    if (match && match[1] === 'mermaid') {
      const code = String(children).replace(/\n$/, '');
      const [svg, setSvg] = useState(null);

      useEffect(() => {
        if (!code) return;
        mermaid.render(`mermaid-${node.position.start.line}`, code)
          .then(({ svg }) => setSvg(svg))
          .catch((err) => console.error('Mermaid 渲染失败:', err));
      }, [code]);

      if (svg) {
        return <div dangerouslySetInnerHTML={{ __html: svg }} />;
      }

      return <pre>{children}</pre>; // 备用：显示原始代码
    }

    return <code className={className} {...props}>{children}</code>;
  };

  if (loading) return <p>加载中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>我的知识点</h1>
      <Link to="/kp/new">
        <button>+ 新建知识点</button>
      </Link>

      <div style={{ marginTop: '20px' }}>
        {knowledgePoints.length === 0 ? (
          <p>暂无知识点</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {knowledgePoints.map((kp) => (
              <li
                key={kp.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#fff',
                }}
              >
                <h2>{kp.title}</h2>
                <div
                  className="markdown-content"
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '6px',
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code: MermaidComponent, // 覆盖 code 组件
                    }}
                  >
                    {kp.content}
                  </ReactMarkdown>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <Link to={`/kp/edit/${kp.id}`} style={{ marginRight: '10px' }}>
                    <button>编辑</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(kp.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;