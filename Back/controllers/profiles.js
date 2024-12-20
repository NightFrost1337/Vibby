const Profile = require('../models/Profile');
const utils = require('../utils');

const allowedInterests = [
    'Music', 'Dance', 'Comedy', 'Food', 'Travel', 'Fashion', 'Sports', 'Gaming',
    'Art', 'Beauty', 'Education', 'Technology', 'Fitness', 'Lifestyle', 'Nature'
];

const getMe = async (req, res) => {
    const profile = await Profile.findOne({ id: req.user.id });
    if (!profile) return res.status(400).json({ error: 'COMPLETE_ONBOARDING', message: 'Onboarding not completed.' });

    const final = profile.toJSON();
    delete final._id;
    delete final.__v;

    return res.status(200).json(final);
}

const completeOnboarding = async (req, res) => {
    const { username, name, avatar, bio, interests } = req.body;

    if (!username) return res.status(400).json({ message: 'Username is required.' });
    if (!name) return res.status(400).json({ message: 'Full name is required.' });

    if (typeof username !== 'string') return res.status(400).json({ message: 'Username must be a string.' });
    if (typeof name !== 'string') return res.status(400).json({ message: 'Full name must be a string.' });
    if (typeof bio !== 'string') return res.status(400).json({ message: 'Bio must be a string.' });

    if (!Array.isArray(interests)) return res.status(400).json({ message: 'Interests must be an array.' });

    const usernameRegex = /^[a-z0-9_.]+$/;

    if (username.length < 3 || username.length > 50) return res.status(400).json({ message: 'Username must be between 3 and 50 characters long.' });
    if (!usernameRegex.test(username)) return res.status(400).json({ message: 'Username must include only lower-case letters, numbers, _ or .' });
    if (utils.hasBadWords(username)) return res.status(400).json({ message: 'Username includes a blacklisted word.' });

    const usernameTaken = await Profile.findOne({ username: username.toLowerCase() });
    if (usernameTaken) return res.status(400).json({ message: 'Username already taken.' });

    if (name.length < 3 || name.length > 50) return res.status(400).json({ message: 'Full name must be between 3 and 50 characters long.' });
    if (utils.hasBadWords(name)) return res.status(400).json({ message: 'Full name includes a blacklisted word.' });

    // TODO: implement avatar verification & upload

    const filteredInterests = interests.filter(interest => allowedInterests.includes(interest));

    const profile = await Profile.findOne({ id: req.user.id });
    if (profile) return res.status(400).json({ error: 'CONBOARDING_ALREADY_COMPLETED', message: 'Onboarding already completed.' });

    await new Profile({ id: req.user.id, username: username.toLowerCase(), name, avatar, bio, interests: filteredInterests }).save();

    return res.status(200).json({ message: 'Onboarding completed.' });
}

const editMe = async (req, res) => {
    console.log(req.body);

    return res.status(400).json({ error: 'NOT_IMPLEMENTED', message: 'Not implemented.' });
}

module.exports = {
    getMe,
    editMe,
    completeOnboarding
};