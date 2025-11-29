import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface ArchiveItem {
  title: string;
  date: string;
}

interface ArchiveData {
  [key: string]: ArchiveItem[];
}

const Archive: React.FC = () => {
  const [archiveData, setArchiveData] = useState<ArchiveData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchive();
  }, []);

  const fetchArchive = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts/archive');
      setArchiveData(response.data);
    } catch (error) {
      console.error('Error fetching archive:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading archive...</p></div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">归档</h1>
      <div className="archive-timeline">
        {Object.entries(archiveData).map(([month, posts]) => (
          <div key={month}>
            <h2 className="archive-year">{month}</h2>
            {posts.map((post, index) => (
              <div key={index} className="archive-item">
                <span className="archive-date">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <Link to={`/post/${post._id}`} className="archive-title">
                  {post.title}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;