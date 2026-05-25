import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminWorkingHours() {
  const { t } = useTranslation();
  const [hours, setHours] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/working-hours').then((r) => {
      setHours(Array.isArray(r.data) ? r.data : []);
    }).catch(() => {});
  }, []);

  const getDayHours = (day) => hours.find((h) => h.day_of_week === day);

  const updateDay = (day, field, value) => {
    setHours((prev) => {
      const existing = prev.find((h) => h.day_of_week === day);
      if (existing) {
        return prev.map((h) => h.day_of_week === day ? { ...h, [field]: value } : h);
      }
      return [...prev, { id: null, day_of_week: day, start_time: '09:00', end_time: '17:00', is_active: true, [field]: value }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await api.put('/working-hours', { hours });
      setMsg(t('admin_hours.success'));
    } catch (err) {
      setMsg(err.response?.data?.message || t('admin_hours.failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">{t('admin_hours.title')}</h1>
          <p className="text-forest/60 mt-2">{t('admin_hours.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-sage/10 shadow-sm p-6 md:p-8">
          <div className="space-y-3">
            {DAYS.map((dayName, dayIndex) => {
              const day = getDayHours(dayIndex);
              return (
                <div key={dayIndex} className="flex flex-wrap items-center gap-3 py-3 px-4 rounded-xl hover:bg-warm transition-colors border border-transparent hover:border-sage/10">
                  <label className="inline-flex items-center gap-3 cursor-pointer w-24">
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${day?.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                      <input
                        type="checkbox"
                        checked={day?.is_active ?? false}
                        onChange={(e) => updateDay(dayIndex, 'is_active', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${day?.is_active ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className={`font-medium text-sm ${day?.is_active ? 'text-forest' : 'text-forest/50'}`}>
                      {t('admin_hours.days_' + ['sun','mon','tue','wed','thu','fri','sat'][dayIndex])}
                    </span>
                  </label>
                  <input
                    type="time" value={day?.start_time || '09:00'}
                    onChange={(e) => updateDay(dayIndex, 'start_time', e.target.value)}
                    disabled={!day?.is_active}
                    className="bg-white border border-sage/20 rounded-lg px-3 py-1.5 text-sm text-forest focus:ring-2 focus:ring-sage outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span className="text-forest/60 text-sm">{t('admin_hours.to')}</span>
                  <input
                    type="time" value={day?.end_time || '17:00'}
                    onChange={(e) => updateDay(dayIndex, 'end_time', e.target.value)}
                    disabled={!day?.is_active}
                    className="bg-white border border-sage/20 rounded-lg px-3 py-1.5 text-sm text-forest focus:ring-2 focus:ring-sage outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 w-full bg-forest text-white py-3 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-lg hover:shadow-forest/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('admin_hours.save_loading')}
              </span>
            ) : t('admin_hours.save')}
          </button>

          {msg && (
            <div className={`mt-4 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in ${
              msg === t('admin_hours.success') ? 'bg-forest/10 border border-forest/20 text-forest' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                {msg === t('admin_hours.success') ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
