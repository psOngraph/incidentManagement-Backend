const Notification = require("../models/Notification");

exports.getNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

exports.createNotification = async (data) => {
  return await Notification.create(data);
};
