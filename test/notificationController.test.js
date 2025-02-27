// notificationController.test.js
const notificationController = require('../controllers/notificationController');
const Notification = require('../models/notification');

jest.mock('../models/notification');

describe('Notification Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a new notification and return it', async () => {
      const req = {
        body: { userId: 'user123', message: 'Test message' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const savedNotification = { userId: 'user123', message: 'Test message' };
      Notification.prototype.save = jest.fn().mockResolvedValue(savedNotification);

      await notificationController.createNotification(req, res);

      expect(Notification.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedNotification);
    });

    it('should handle errors and return a 500 status', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Notification.prototype.save = jest.fn().mockRejectedValue(new Error('Save error'));

      await notificationController.createNotification(req, res);

      expect(Notification.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating notification',
        error: 'Save error',
      });
    });
  });

  describe('getNotifications', () => {
    it('should fetch notifications for a user', async () => {
      const req = { userId: 'user123' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const notifications = [{ id: 1, message: 'Test notification' }];
      Notification.find = jest.fn().mockResolvedValue(notifications);

      await notificationController.getNotifications(req, res);

      expect(Notification.find).toHaveBeenCalledWith({
        $or: [{ userId: 'user123' }, { isGlobal: true }],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(notifications);
    });

    it('should handle errors and return a 500 status', async () => {
      const req = { userId: 'user123' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Notification.find = jest.fn().mockRejectedValue(new Error('Find error'));

      await notificationController.getNotifications(req, res);

      expect(Notification.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching notifications',
        error: 'Find error',
      });
    });
  });

  describe('updateNotificationStatus', () => {
    it('should mark notifications as seen', async () => {
      const req = { userId: 'user123' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Notification.updateMany = jest.fn().mockResolvedValue({ nModified: 1 });

      await notificationController.updateNotificationStatus(req, res);

      expect(Notification.updateMany).toHaveBeenCalledWith(
        { userId: 'user123' },
        { status: 'seen' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notifications marked as seen' });
    });

    it('should handle errors and return a 500 status', async () => {
      const req = { userId: 'user123' };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Notification.updateMany = jest.fn().mockRejectedValue(new Error('Update error'));

      await notificationController.updateNotificationStatus(req, res);

      expect(Notification.updateMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating notification status',
        error: 'Update error',
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification by ID', async () => {
      const req = { params: { notificationId: 'notif123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      Notification.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await notificationController.deleteNotification(req, res);

      expect(Notification.findByIdAndDelete).toHaveBeenCalledWith('notif123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle errors and return a 500 status', async () => {
      const req = { params: { notificationId: 'notif123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Notification.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Delete error'));

      await notificationController.deleteNotification(req, res);

      expect(Notification.findByIdAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting notification',
        error: 'Delete error',
      });
    });
  });
});
