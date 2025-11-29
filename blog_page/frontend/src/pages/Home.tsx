import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  tags: string[];
  createdAt: string;
  author: {
    username: string;
  };
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts?page=${currentPage}&limit=5`);
      setPosts(response.data.posts);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post._id} className="card">
            <h2 className="card-title">
              <Link to={`/post/${post._id}`}>{post.title}</Link>
            </h2>
            <div className="post-meta">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span> • </span>
              <span>By {post.author.username}</span>
            </div>
            <div className="post-excerpt">
              {post.excerpt || post.content.substring(0, 200) + '...'}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;