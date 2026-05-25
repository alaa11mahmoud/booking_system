import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const statusBadge = (status) => {
  switch (status) {
    case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const statusIcon = (status) => {
  switch (status) {
    case 'approved': return '✓';
    case 'pending': return '…';
    case 'rejected': return '✕';
    default: return '?';
  }
};

export default function PatientDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unreadCount = 0 } = useNotifications() || {};

  useEffect(() => {
    api.get('/bookings').then((r) => {
      const data = r.data.data ?? r.data;
      setAppointments(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusIconStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400';
      case 'rejected': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">{t('patient_dashboard.title')}</h1>
            <p className="text-forest/60 mt-1">{t('patient_dashboard.greeting', { name: user?.name })}</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="bg-sage/10 text-sage-dark px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 animate-fade-in border border-sage/20">
                <span className="w-2 h-2 bg-sage rounded-full" />
                {unreadCount === 1 ? t('patient_dashboard.new_notification', { count: unreadCount }) : t('patient_dashboard.new_notifications', { count: unreadCount })}
              </span>
            )}
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-sage/10 animate-fade-in">
            <svg className="w-16 h-16 text-forest/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-forest/60 text-lg mb-2">{t('patient_dashboard.no_appointments')}</p>
            <Link to="/book" className="inline-flex items-center gap-2 bg-forest text-white px-6 py-2.5 rounded-xl font-medium hover:bg-forest-light transition-all hover:shadow-lg active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('patient_dashboard.book_first')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, idx) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-sage/10 p-6 card-hover animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${statusIconStyle(apt.status)}`}>
                      {statusIcon(apt.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-forest text-lg">
                        {new Date(apt.appointment_date + 'T' + apt.start_time).toLocaleDateString('ar-SA', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-forest/60 mt-1">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {apt.start_time?.substring(0, 5)} - {apt.end_time?.substring(0, 5)}
                      </p>
                      {apt.patient_notes && (
                        <p className="text-sm text-forest/60 italic mt-2 bg-warm rounded-lg px-3 py-2">"{apt.patient_notes}"</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border shrink-0 ${statusBadge(apt.status)}`}>
                    {apt.status === 'approved' ? t('patient_dashboard.status_approved') : apt.status === 'rejected' ? t('patient_dashboard.status_rejected') : t('patient_dashboard.status_pending')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
