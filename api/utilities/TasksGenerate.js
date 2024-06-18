const Task = require('../models/Task');
const User = require('../models/User');

async function generateUserTasks(userId, accountLevel) {
    const tasksToAdd = [];

    const existingTasks = await Task.find({ user: userId });

    const taskDescriptions = existingTasks.map(task => task.description);

    if (accountLevel === 'client' || accountLevel === 'owner') {
        if (!taskDescriptions.includes('Upload Profile picture')) {
            tasksToAdd.push({ description: 'Upload Profile picture', user: userId });
        }
        if (!taskDescriptions.includes('Fill out bio')) {
            tasksToAdd.push({ description: 'Fill out bio', user: userId });
        }
    }

    if (accountLevel === 'owner') {
        if (!taskDescriptions.includes('Sign up to Stripe for payment processing')) {
            tasksToAdd.push({ description: 'Sign up to Stripe for payment processing', user: userId });
        }
    }

    if (tasksToAdd.length > 0) {
        const createdTasks = await Task.insertMany(tasksToAdd);
        await User.findByIdAndUpdate(userId, { $push: { tasks: { $each: createdTasks.map(task => task._id) } } });
    }
}

module.exports = { generateUserTasks };
