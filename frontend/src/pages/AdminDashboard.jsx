import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

function StatusModal({ action, appointment, message, onMessageChange, onSubmit, onClose, processing }) {
  const { t } = useTranslation();
  const isApprove = action === 'approve';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-sage/10" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-sage/10">
          <h2 className="text-lg font-bold text-forest">{isApprove ? t('admin_dashboard.modal_accept') : t('admin_dashboard.modal_reject')}</h2>
          <p className="text-sm text-forest/60 mt-1">
            {appointment?.patient?.user?.name} — {appointment?.appointment_date}
          </p>
        </div>
        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-forest/70 mb-2">{t('admin_dashboard.modal_message')} <span className="text-forest/40">{t('admin_dashboard.modal_optional')}</span></label>
          <textarea
            value={message}
            onChange={e => onMessageChange(e.target.value)}
            placeholder={t('admin_dashboard.modal_placeholder')}
            rows={4}
            className={`w-full bg-white border border-sage/20 rounded-xl px-4 py-3 text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm ${isApprove ? 'focus:ring-sage' : 'focus:ring-red-500'}`}
            autoFocus
          />
        </div>
        <div className="px-6 py-4 border-t border-sage/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-5 py-2 rounded-xl text-sm font-medium text-forest/60 hover:bg-forest/5 transition-all disabled:opacity-50"
          >
            {t('admin_dashboard.modal_cancel')}
          </button>
          <button
            onClick={onSubmit}
            disabled={processing}
            className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isApprove ? 'bg-forest hover:bg-forest-light' : 'bg-red-600 hover:bg-red-500'}`}
          >
            {processing ? t('admin_dashboard.processing') : isApprove ? t('admin_dashboard.modal_confirm_accept') : t('admin_dashboard.modal_confirm_reject')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());
  const [statusModal, setStatusModal] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const rowRefs = useRef({});

  const fetch = (statusFilter) => {
    const params = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
    api.get('/bookings', { params }).then((r) => {
      const data = r.data.data ?? r.data;
      setAppointments(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(filter); }, [filter]);

  useEffect(() => {
    if (!highlightId || appointments.length === 0) return;
    const timer = setTimeout(() => {
      const el = rowRefs.current[highlightId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [highlightId, appointments]);

  const openStatusModal = (apt, action) => {
    setStatusMessage('');
    setStatusModal({ apt, action });
  };

  const updateStatus = async (id, status, rejection_reason) => {
    if (processing.has(id)) return;
    setProcessing(prev => new Set(prev).add(id));
    try {
      await api.patch(`/bookings/${id}/status`, { status, rejection_reason: rejection_reason || undefined });
      fetch(filter);
      setStatusModal(null);
    } catch (err) {
      alert(err.response?.data?.message || t('admin_dashboard.error'));
    } finally {
      setProcessing(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-forest" />
      </div>
    );
  }

  const statusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'completed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <>
      <div className="min-h-[90vh] bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">{t('admin_dashboard.title')}</h1>
            <p className="text-forest/60 mt-1">{t('admin_dashboard.subtitle')}</p>
          </div>
          <div className="bg-white rounded-xl border border-sage/10 shadow-sm px-4 py-2">
            <span className="text-sm text-forest/60">{t('admin_dashboard.total')}</span>
            <span className="font-bold text-forest">{appointments.length}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-forest text-white shadow-sm' : 'bg-white text-forest/60 border border-sage/10 hover:bg-forest/5'
            }`}
          >
            {t('admin_dashboard.filter_all')}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'approved' ? 'bg-forest text-white shadow-sm' : 'bg-white text-forest/60 border border-sage/10 hover:bg-forest/5'
            }`}
          >
            {t('admin_dashboard.filter_accepted')}
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'rejected' ? 'bg-forest text-white shadow-sm' : 'bg-white text-forest/60 border border-sage/10 hover:bg-forest/5'
            }`}
          >
            {t('admin_dashboard.filter_rejected')}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'completed' ? 'bg-forest text-white shadow-sm' : 'bg-white text-forest/60 border border-sage/10 hover:bg-forest/5'
            }`}
          >
            {t('admin_dashboard.filter_completed')}
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-sage/10 shadow-sm">
            <p className="text-forest/40 text-lg">
              {filter === 'all' ? t('admin_dashboard.no_bookings') : filter === 'approved' ? t('admin_dashboard.no_accepted') : filter === 'rejected' ? t('admin_dashboard.no_rejected') : t('admin_dashboard.no_completed')}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-sage/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-forest border-b border-forest-light">
                    <th className="text-left py-4 px-6 font-semibold text-white text-xs uppercase tracking-wider">{t('admin_dashboard.table_patient')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-white text-xs uppercase tracking-wider">{t('admin_dashboard.table_email')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-white text-xs uppercase tracking-wider">{t('admin_dashboard.table_date')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-white text-xs uppercase tracking-wider">{t('admin_dashboard.table_time')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-white text-xs uppercase tracking-wider">{t('admin_dashboard.table_status')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-white text-xs uppercase tracking-wider">{t('admin_dashboard.table_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/10">
                    {appointments.map((apt, idx) => (
                      <tr
                        key={apt.id}
                        ref={(el) => { if (el) rowRefs.current[apt.id] = el; }}
                        className={`transition-colors animate-fade-in ${
                          highlightId && String(apt.id) === highlightId
                            ? 'bg-sage/20 ring-2 ring-sage ring-inset'
                            : 'hover:bg-forest/5'
                        }`}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                      <td className="text-left py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center text-sage font-bold text-xs">
                            {apt.patient?.user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-forest">{apt.patient?.user?.name || t('admin_dashboard.na')}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6 text-forest/60">{apt.patient?.user?.email || t('admin_dashboard.na')}</td>
                      <td className="text-center py-4 px-6 text-forest/80">
                        {new Date(apt.appointment_date + 'T12:00:00').toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="text-center py-4 px-6 text-forest/60">{apt.start_time?.substring(0, 5)} - {apt.end_time?.substring(0, 5)}</td>
                      <td className="text-center py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(apt.status)}`}>
                          {apt.status === 'approved' ? t('admin_dashboard.status_accepted') : apt.status === 'rejected' ? t('admin_dashboard.status_declined') : apt.status === 'completed' ? t('admin_dashboard.status_completed') : t('admin_dashboard.filter_all')}
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        {apt.status === 'pending' ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => openStatusModal(apt, 'approve')}
                              disabled={processing.has(apt.id)}
                              className="bg-forest text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-forest-light transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                              <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              {processing.has(apt.id) ? t('admin_dashboard.processing') : t('admin_dashboard.accept')}
                            </button>
                            <button
                              onClick={() => openStatusModal(apt, 'reject')}
                              disabled={processing.has(apt.id)}
                              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                              <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {processing.has(apt.id) ? t('admin_dashboard.processing') : t('admin_dashboard.decline')}
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs font-medium flex items-center gap-1 ${
                            apt.status === 'approved' ? 'text-green-600' : apt.status === 'completed' ? 'text-gray-600' : 'text-red-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'approved' ? 'bg-green-600' : apt.status === 'completed' ? 'bg-gray-600' : 'bg-red-600'}`} />
                            {apt.status === 'approved' ? t('admin_dashboard.status_accepted') : apt.status === 'completed' ? t('admin_dashboard.status_completed') : t('admin_dashboard.status_declined')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {statusModal && (
        <StatusModal
          action={statusModal.action}
          appointment={statusModal.apt}
          message={statusMessage}
          onMessageChange={setStatusMessage}
          onSubmit={() => updateStatus(statusModal.apt.id, statusModal.action === 'approve' ? 'approved' : 'rejected', statusMessage)}
          onClose={() => { if (!processing.has(statusModal.apt.id)) setStatusModal(null); }}
          processing={processing.has(statusModal.apt.id)}
        />
      )}
      </div>
    </>
  );
}
