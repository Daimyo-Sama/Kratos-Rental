import { useState } from 'react';
import axios from 'axios';

export default function ReviewForm({ carId, reviewedUserId, tripId }) {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/reviews', {
                reviewedUserId,
                tripId,
                carId,
                rating,
                comment
            });
            alert('Review submitted successfully');
        } catch (error) {
            alert('Failed to submit review');
        }
    };

    return (
        <form onSubmit={submitReview}>
            <label>
                Rating:
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    min="1"
                    max="5"
                    required
                />
            </label>
            <label>
                Comment:
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>
            </label>
            <button type="submit">Submit Review</button>
        </form>
    );
}
