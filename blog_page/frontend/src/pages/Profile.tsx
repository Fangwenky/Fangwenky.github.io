import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
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
  experience: Experience[];
  education: Education[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading profile...</p></div>;
  }

  if (!profile) {
    return <div className="container"><p>Profile not found</p></div>;
  }

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          {profile.avatar && (
            <img 
              src={profile.avatar} 
              alt="Profile" 
              className="profile-avatar"
            />
          )}
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            {profile.location && (
              <p className="profile-location">📍 {profile.location}</p>
            )}
            <div className="profile-links">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="profile-link">
                  📧 {profile.email}
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                  💻 GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                  💼 LinkedIn
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🐦 Twitter
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          <section className="profile-section">
            <h2>关于我</h2>
            <p>{profile.bio}</p>
          </section>
          
          {profile.skills && profile.skills.length > 0 && (
            <section className="profile-section">
              <h2>技能</h2>
              <div className="skills-list">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}
          
          {profile.experience && profile.experience.length > 0 && (
            <section className="profile-section">
              <h2>工作经历</h2>
              <div className="experience-list">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h3>{exp.position}</h3>
                    <p className="company">{exp.company}</p>
                    <p className="date">
                      {new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}
                    </p>
                    <p>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {profile.education && profile.education.length > 0 && (
            <section className="profile-section">
              <h2>教育背景</h2>
              <div className="education-list">
                {profile.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h3>{edu.degree}</h3>
                    <p className="school">{edu.school}</p>
                    <p className="field">{edu.field}</p>
                    <p className="date">
                      {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;