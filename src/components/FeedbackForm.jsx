import React, { useState } from 'react';
import { Star, MessageSquareHeart } from 'lucide-react';

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 && !comment.trim()) return;

    const newFeedback = {
      id: Date.now(),
      date: new Date().toISOString(),
      rating,
      comment
    };

    // Save to localStorage
    const existingFeedbacks = JSON.parse(localStorage.getItem('ofisgunu_feedbacks') || '[]');
    localStorage.setItem('ofisgunu_feedbacks', JSON.stringify([...existingFeedbacks, newFeedback]));

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel feedback-panel animate-pop success-state">
        <MessageSquareHeart size={40} color="var(--color-home)" style={{ marginBottom: '1rem' }} />
        <h3>Geri Bildiriminiz Alındı!</h3>
        <p>Değerli fikirlerinizi bizimle paylaştığınız için teşekkür ederiz.</p>
        <button className="submit-btn" onClick={() => { setIsSubmitted(false); setRating(0); setComment(''); }}>
          Yeni Mesaj Gönder
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel feedback-panel animate-pop">
      <div className="feedback-header">
        <MessageSquareHeart size={24} color="var(--text-primary)" />
        <h2>Görüşlerinizi Paylaşın</h2>
      </div>
      <p className="feedback-desc">Deneyiminizi puanlayın veya uygulamada görmek istediğiniz özellikleri bize iletin.</p>
      
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              className={`star-icon ${(hoverRating || rating) >= star ? 'active' : ''}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
            />
          ))}
        </div>

        <textarea
          placeholder="İstekleriniz, önerileriniz veya şikayetleriniz..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="feedback-textarea"
          rows="3"
        ></textarea>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={rating === 0 && !comment.trim()}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
