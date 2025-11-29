import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="nav-brand">
            My Blog
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">首页</Link>
            </li>
            <li className="nav-item">
              <Link to="/archive" className="nav-link">归档</Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">关于</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">登录</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;