import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components.css';

const leadershipQuotes = [
  {
    name: "Shri. Jasoda Ranjan Das",
    title: "President of SSA Society",
    quote: "Girijananda Chowdhury University (GCU) is a proud embodiment of the vision and commitment of the Shrimanta Shankar Academy Society.",
    image: "/assets/Pres-img-ssa.jpg",
    link: "/presmsg"
  },
  {
    name: "Prof. Jayanta Deka",
    title: "Chancellor of GCU",
    quote: "As we reflect on the remarkable journey of our university, I am reminded of the dedication and achievements of our alumni.",
    image: "/assets/jayanta-sir.jpg",
    link: "/cmsg"
  },
  {
    name: "Prof. Kandarpa Das",
    title: "Vice Chancellor of GCU",
    quote: "Girijananda Chowdhury University (GCU) stands as a testament to the vision and dedication of the Shrimanta Shankar Academy Society.",
    image: "/assets/vc-gcu.jpg",
    link: "/vcmsg"
  },
  {
    name: "Prof. Dipankar Saha",
    title: "Registrar of GCU",
    quote: "As we celebrate another year of growth, connection, and achievement, I am honored to address you as President of our Alumni Association.",
    image: "/assets/gcuregistrar.jpg",
    link: "/registrarmsg"
  }
];

const LeadershipQuotesBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % leadershipQuotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = leadershipQuotes[currentIndex];

  return (
    <div className="leadership-quotes-banner">
      <div className="quotes-container">
        <div className="quote-avatar">
          <img src={current.image} alt={current.name} />
        </div>
        <div className="quote-content">
          <span className="quote-icon">“</span>
          <p className="quote-text">
            {current.quote}{' '}
            <Link to={current.link} className="quote-read-more">
              [Read More]
            </Link>
          </p>
          <div className="quote-author">
            <strong>{current.name}</strong> — <span className="quote-title">{current.title}</span>
          </div>
        </div>
        <div className="quote-dots">
          {leadershipQuotes.map((_, idx) => (
            <span
              key={idx}
              className={`quote-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadershipQuotesBanner;
