import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function NotificationModal({ notification, onClose }) {
  if (!notification) return null;
  const { t } = useTranslation();
  const { data } = notification;
  const isSubscription = data?.subscription_id;

  if (isSubscription) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full maxw-sm mx-4 overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-sage/10 px-6 py-5 flex items-center justify-between border-b border-sage/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-forest">اشتراك جديد</h2>
                <p className="text-sm text-forest/60">تم اشتراك مريض في منشور</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sage/10 flex items-center justify-center text-sage shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">المريض</p>
                <p className="text-forest font-semibold">{data?.patient_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">المنشور</p>
                <p className="text-forest font-semibold">{data?.post_title}</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-5">
            <button
              onClick={onClose}
              className="w-full bg-forest text-white py-2.5 rounded-xl hover:bg-forest-light transition-all font-medium text-sm active:scale-[0.98]"
            >
              {t('notifications.modal_close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    approved: { icon: '✓', label: t('notifications.status_approved'), bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-500' },
    rejected: { icon: '✕', label: t('notifications.status_rejected'), bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-500' },
    pending: { icon: '…', label: t('notifications.status_pending'), bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-500' },
  };
  const cfg = statusConfig[data?.status] || statusConfig.pending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full maxw-sm mx-4 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${cfg.bg} px-6 py-5 flex items-center justify-between border-b ${cfg.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${cfg.badge} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
              {cfg.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-forest">{t('notifications.modal_title', { status: cfg.label })}</h2>
              <p className="text-sm text-forest/60">{t('notifications.modal_subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sage/10 flex items-center justify-center text-sage shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">المريض</p>
              <p className="text-forest font-semibold">{data?.patient_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{t('notifications.modal_date')}</p>
                <p className="text-forest font-semibold">{data?.appointment_date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{t('notifications.modal_time')}</p>
                <p className="text-forest font-semibold">{data?.start_time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.text} shrink-0`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{t('notifications.modal_status')}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} border`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.badge}`} />
                {cfg.label}
              </span>
            </div>
          </div>

          {data?.rejection_reason && (
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-xs text-red-400 uppercase tracking-wide font-medium mb-1">{t('notifications.modal_rejection_reason')}</p>
              <p className="text-red-700 text-sm leading-relaxed">{data.rejection_reason}</p>
            </div>
          )}

          {data?.message && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{t('notifications.modal_message')}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{data.message}</p>
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-800 transition-all font-medium text-sm active:scale-[0.98]"
          >
            {t('notifications.modal_close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const statusBadgeBg = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.read_at) markAsRead(n.id);
    setOpen(false);
    if (user?.role === 'admin') {
      if (n.data?.subscription_id) {
        setSelectedNotification(n);
      } else {
        navigate('/admin');
      }
      return;
    }
    setSelectedNotification(n);
  };

  return (
    <>
      <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-xl text-forest hover:bg-forest/5 transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl z-50 border border-gray-100 overflow-hidden animate-dropdown-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {t('notifications.title')}
                {unreadCount > 0 && (
                  <span className="bg-sage/10 text-sage text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t('notifications.new', { count: unreadCount })}</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-sage hover:text-forest font-medium hover:underline transition-colors">
                  {t('notifications.mark_all_read')}
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-8 px-4">
                  <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-gray-400 text-sm">{t('notifications.empty')}</p>
                </div>
              ) : (
                notifications.map((n, idx) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all active:scale-[0.99] ${
                      !n.read_at ? 'bg-sage/5 border-l-2 border-l-sage' : 'border-l-2 border-l-transparent'
                    } ${idx === notifications.length - 1 ? 'border-b-0' : ''}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read_at ? 'bg-sage' : 'bg-transparent'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${!n.read_at ? 'font-semibold text-forest' : 'text-forest/60'}`}>
                          {n.data?.message || t('notifications.default_message')}
                        </p>
                        {n.data?.rejection_reason && (
                          <p className="text-xs text-red-500 mt-0.5 truncate">{n.data.rejection_reason}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${n.data?.subscription_id ? 'bg-sage/10 text-sage' : statusBadgeBg(n.data?.status)}`}>
                            {n.data?.subscription_id ? 'اشتراك' : (n.data?.status?.toUpperCase() || 'جديد')}
                          </span>
                          {!n.data?.subscription_id && n.data?.appointment_date && (
                            <span className="text-[11px] text-gray-400">{n.data.appointment_date}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <NotificationModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </>
  );
}
