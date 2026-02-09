import Feedback from '../models/Feedback.js';

// Submit feedback
const submitFeedback = async (req, res) => {
    try {
        const { rating, review, location } = req.body;
        const user = req.user;

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Create feedback
        const feedback = new Feedback({
            user: user._id,
            userName: user.username,
            userEmail: user.email,
            userImage: user.image,
            rating,
            review,
            location: location || 'Unknown',
            isApproved: false
        });

        await feedback.save();

        res.json({
            success: true,
            message: 'Thank you for your feedback! It will be reviewed and published soon.'
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get all approved feedback
const getApprovedFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ success: true, feedbacks });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get all feedback (admin only)
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 });

        res.json({ success: true, feedbacks });
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        res.json({ success: false, message: error.message });
    }
};

// Approve feedback (admin only)
const approveFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { isApproved: true },
            { new: true }
        );

        if (!feedback) {
            return res.json({ success: false, message: 'Feedback not found' });
        }

        res.json({ success: true, message: 'Feedback approved successfully', feedback });
    } catch (error) {
        console.error('Error approving feedback:', error);
        res.json({ success: false, message: error.message });
    }
};

// Delete feedback (admin only)
const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!feedback) {
            return res.json({ success: false, message: 'Feedback not found' });
        }

        res.json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    submitFeedback,
    getApprovedFeedback,
    getAllFeedback,
    approveFeedback,
    deleteFeedback
};
