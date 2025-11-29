import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  published: boolean;
  createdAt: string;
}

interface Profile {
  name: string;
  bio: string;
  avatar: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  location: string;
  skills: string[];
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'profile'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    category: '',
    published: false,
  });
  
  const [profileForm, setProfileForm] = useState<Profile>({
    name: '',
    bio: '',
    avatar: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    location: '',
    skills: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchPosts();
    fetchProfile();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts?published=false');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfileForm(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const tagsArray = postForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await axios.post('/api/posts', {
        ...postForm,
        tags: tagsArray,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPostForm({
        title: '',
        content: '',
        excerpt: '',
        tags: '',
        category: '',
        published: false,
      });
      
      fetchPosts();
      alert('文章创建成功！');
    } catch (error: any) {
      setError(error.response?.data?.message || '创建文章失败');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile', profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('个人资料更新成功！');
    } catch (error: any) {
      setError(error.response?.data?.message || '更新资料失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>管理后台</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          退出登录
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="admin-tabs">
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          文章管理
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          个人资料
        </button>
      </div>
      
      {activeTab === 'posts' && (
        <div className="admin-content">
          <div className="posts-list">
            <h2>我的文章</h2>
            {posts.map((post) => (
              <div key={post._id} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-actions">
                  <button className="btn btn-secondary">编辑</button>
                  <button className="btn btn-secondary">删除</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="post-form">
            <h2>创建新文章</h2>
            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>摘要</label>
                <input
                  type="text"
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>分类</label>
                <input
                  type="text"
                  value={postForm.category}
                  onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>标签 (用逗号分隔)</label>
                <input
                  type="text"
                  value={postForm.tags}
                  onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>内容</label>
                <textarea
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  rows={10}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={postForm.published}
                    onChange={(e) => setPostForm({...postForm, published: e.target.checked})}
                  />
                  发布文章
                </label>
              </div>
              
              <button type="submit" className="btn">
                创建文章
              </button>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="admin-content">
          <div className="profile-form">
            <h2>编辑个人资料</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>姓名</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>个人简介</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>头像URL</label>
                <input
                  type="text"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>邮箱</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="text"
                  value={profileForm.github}
                  onChange={(e) => setProfileForm({...profileForm, github: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  value={profileForm.linkedin}
                  onChange={(e) => setProfileForm({...profileForm, linkedin: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="text"
                  value={profileForm.twitter}
                  onChange={(e) => setProfileForm({...profileForm, twitter: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>个人网站</label>
                <input
                  type="text"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>位置</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>技能 (用逗号分隔)</label>
                <input
                  type="text"
                  value={profileForm.skills.join(', ')}
                  onChange={(e) => setProfileForm({...profileForm, skills: e.target.value.split(',').map(skill => skill.trim())})}
                />
              </div>
              
              <button type="submit" className="btn">
                更新资料
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;