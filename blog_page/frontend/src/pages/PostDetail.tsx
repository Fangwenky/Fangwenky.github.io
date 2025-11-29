import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GitalkComponent from 'gitalk-react-component';

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: {
    username: string;
  };
  viewCount: number;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading post...</p></div>;
  }

  if (!post) {
    return <div className="container"><p>Post not found</p></div>;
  }

  return (
    <div className="container">
      <article className="post-detail">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span> • </span>
            <span>By {post.author.username}</span>
            <span> • </span>
            <span>{post.viewCount} views</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </header>
        
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <section className="comments-section">
          <h3>评论</h3>
          <GitalkComponent
            options={{
              clientID: 'your-github-client-id',
              clientSecret: 'your-github-client-secret',
              repo: 'your-repo-name',
              owner: 'your-github-username',
              admin: ['your-github-username'],
              id: post._id,
              distractionFreeMode: false,
            }}
          />
        </section>
      </article>
    </div>
  );
};

export default PostDetail;