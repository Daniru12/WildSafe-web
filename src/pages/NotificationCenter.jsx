import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useFixedNavOffsetClass } from '../hooks/useFixedNavOffsetClass';
import api from '../utils/api';
import {
  Bell,
  BellRing,
  Check,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Filter
} from 'lucide-react';

const TAB_ALL = 'ALL';
const TAB_EMERGENCY = 'EMERGENCY';
const TAB_ASSIGNED = 'ASSIGNED';

const emergencyTypes = new Set(['NEW_INCIDENT', 'geo-alert', 'URGENT_ALERT']);
const assignedTypes = new Set(['ASSIGNMENT', 'CASE_ASSIGNED']);

const NotificationCenter = () => {
  const navigate = useNavigate();
  const navPt = useFixedNavOffsetClass();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_ALL);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('isRead', 'false');
      params.append('limit', '200');

      const response = await api.get(`/notifications?${params.toString()}`);
      setNotifications(response.data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadNotifications();

    const handleNotificationsUpdated = () => {
      fetchUnreadNotifications();
    };

    window.addEventListener('notifications:updated', handleNotificationsUpdated);
    return () => {
      window.removeEventListener('notifications:updated', handleNotificationsUpdated);
    };
  }, [fetchUnreadNotifications]);

  const isEmergency = (notification) => {
    if (emergencyTypes.has(notification.type)) return true;
    return notification.priority === 'URGENT';
  };

  const isAssigned = (notification) => assignedTypes.has(notification.type);

  const extractCaseId = (notification) => {
    if (notification.caseId) return notification.caseId;
    if (notification.metadata?.caseId) return notification.metadata.caseId;
    if (notification.relatedIncident?._id) return notification.relatedIncident._id;
    if (notification.relatedIncident) return notification.relatedIncident;
    return null;
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === TAB_EMERGENCY) {
      return notifications.filter(isEmergency);
    }
    if (activeTab === TAB_ASSIGNED) {
      return notifications.filter(isAssigned);
    }
    return notifications;
  }, [activeTab, notifications]);

  const emergencyCount = useMemo(
    () => notifications.filter(isEmergency).length,
    [notifications]
  );

  const assignedCount = useMemo(
    () => notifications.filter(isAssigned).length,
    [notifications]
  );

  const unreadCount = notifications.length;

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      window.dispatchEvent(new Event('notifications:updated'));
    } catch {
      setError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications([]);
      window.dispatchEvent(new Event('notifications:updated'));
    } catch {
      setError('Failed to mark all notifications as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    const caseId = extractCaseId(notification);
    if (caseId) {
      navigate(`/cases/${caseId}`);
    }
  };

  const getNotificationIcon = (notification) => {
    if (isEmergency(notification)) {
      return <AlertTriangle size={16} className="text-red-500" />;
    }
    if (isAssigned(notification)) {
      return <BellRing size={16} className="text-blue-500" />;
    }
    return <Bell size={16} className="text-gray-500" />;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${Math.max(diffInMinutes, 1)} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    if (diffInHours < 24) {
      const roundedHours = Math.floor(diffInHours);
      return `${roundedHours} hour${roundedHours !== 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-16">
        <Navbar />
        <div className={`max-w-4xl mx-auto px-6 ${navPt || 'mt-12'}`}>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <div className={`max-w-4xl mx-auto px-6 animate-fade-in ${navPt || 'mt-12'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BellRing size={32} className="text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">New Notifications</h1>
              <p className="text-text-muted">Only unread notifications are shown here</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
            >
              <Check size={16} />
              Mark All as Read
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 glass-morphism">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">All New</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Bell size={24} className="text-gray-500" />
            </div>
          </div>

          <div className="p-6 glass-morphism">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Emergency Alerts</p>
                <p className="text-2xl font-bold text-red-600">{emergencyCount}</p>
              </div>
              <AlertTriangle size={24} className="text-red-500" />
            </div>
          </div>

          <div className="p-6 glass-morphism">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Assigned Cases</p>
                <p className="text-2xl font-bold text-blue-600">{assignedCount}</p>
              </div>
              <BellRing size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="p-6 glass-morphism mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">Notification Tabs</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab(TAB_ALL)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === TAB_ALL
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-surface-light'
              }`}
            >
              All New ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab(TAB_EMERGENCY)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === TAB_EMERGENCY
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-surface-light'
              }`}
            >
              Emergency Alerts ({emergencyCount})
            </button>
            <button
              onClick={() => setActiveTab(TAB_ASSIGNED)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === TAB_ASSIGNED
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-surface-light'
              }`}
            >
              Assigned Case Notifications ({assignedCount})
            </button>
          </div>
        </div>

        <div className="glass-morphism">
          {error && (
            <div className="p-4 bg-red-500/10 border border-danger text-danger text-center">
              {error}
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              <CheckCircle size={48} className="mx-auto mb-4 opacity-70 text-green-500" />
              <p>No unread notifications in this tab</p>
              <p className="text-sm mt-2">New incoming notifications will appear here automatically.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-6 hover:bg-surface-light transition-colors cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{notification.message}</p>
                          <p className="text-xs text-text-muted mt-1">{notification.title}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(notification.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          Unread
                        </div>
                        <span className="px-2 py-0.5 border border-border rounded-full uppercase text-[10px] tracking-wide">
                          {notification.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
