// API接口交互文件

const API_BASE_URL = 'http://localhost:3000/api';

// 留言相关API
const MessageAPI = {
  // 获取所有显示状态的留言
  getAllPublic: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/public`);
      if (!response.ok) throw new Error('获取留言失败');
      return await response.json();
    } catch (error) {
      console.error('获取留言错误:', error);
      throw error;
    }
  },
  
  // 获取置顶留言
  getPinned: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/pinned`);
      if (!response.ok) {
        if (response.status === 404) return null; // 没有置顶留言
        throw new Error('获取置顶留言失败');
      }
      return await response.json();
    } catch (error) {
      console.error('获取置顶留言错误:', error);
      throw error;
    }
  },
  
  // 获取单个留言及其评论
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${id}`);
      if (!response.ok) throw new Error('获取留言详情失败');
      return await response.json();
    } catch (error) {
      console.error('获取留言详情错误:', error);
      throw error;
    }
  },
  
  // 提交新留言
  create: async (author, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, content })
      });
      if (!response.ok) throw new Error('提交留言失败');
      return await response.json();
    } catch (error) {
      console.error('提交留言错误:', error);
      throw error;
    }
  },
  
  // 点赞留言
  like: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${id}/like`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('点赞失败');
      return await response.json();
    } catch (error) {
      console.error('点赞错误:', error);
      throw error;
    }
  }
};

// 评论相关API
const CommentAPI = {
  // 获取特定留言的所有显示状态的评论
  getByMessageId: async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/message/${messageId}`);
      if (!response.ok) throw new Error('获取评论失败');
      return await response.json();
    } catch (error) {
      console.error('获取评论错误:', error);
      throw error;
    }
  },
  
  // 提交新评论
  create: async (messageId, author, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageId, author, content })
      });
      if (!response.ok) throw new Error('提交评论失败');
      return await response.json();
    } catch (error) {
      console.error('提交评论错误:', error);
      throw error;
    }
  },
  
  // 点赞评论
  like: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}/like`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('点赞失败');
      return await response.json();
    } catch (error) {
      console.error('点赞错误:', error);
      throw error;
    }
  }
};

// 同学相关API
const ClassmateAPI = {
  // 按省份获取同学
  getByProvince: async (provinceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classmates/province/${provinceId}`);
      if (!response.ok) throw new Error('获取同学信息失败');
      return await response.json();
    } catch (error) {
      console.error('获取同学信息错误:', error);
      throw error;
    }
  }
};

// 省份相关API
const ProvinceAPI = {
  // 获取所有省份
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/provinces`);
      if (!response.ok) throw new Error('获取省份失败');
      return await response.json();
    } catch (error) {
      console.error('获取省份错误:', error);
      throw error;
    }
  }
};

// 管理员相关API
const AdminAPI = {
  // 管理员登录
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) throw new Error('登录失败');
      return await response.json();
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    }
  },
  
  // 获取当前管理员信息
  getCurrentAdmin: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('获取管理员信息失败');
      return await response.json();
    } catch (error) {
      console.error('获取管理员信息错误:', error);
      throw error;
    }
  },
  
  // 修改管理员密码
  changePassword: async (token, currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (!response.ok) throw new Error('修改密码失败');
      return await response.json();
    } catch (error) {
      console.error('修改密码错误:', error);
      throw error;
    }
  }
};

// 导出所有API
const API = {
  Message: MessageAPI,
  Comment: CommentAPI,
  Classmate: ClassmateAPI,
  Province: ProvinceAPI,
  Admin: AdminAPI
};