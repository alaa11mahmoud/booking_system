import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function BookingPage() {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/slots', { params: { date } })
      .then((r) => setSlots(r.data.slots))
      .catch(() => setSlots([]));
    setSelectedSlot(null);
  }, [date]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setMessage('');
    try {
      await api.post('/bookings', {
        appointment_date: date,
        start_time: selectedSlot.start_time,
        patient_notes: notes,
      });
      setMessage(t('booking.success'));
      setSelectedSlot(null);
      setNotes('');
      setSlots((prev) => prev.filter((s) => s.start_time !== selectedSlot.start_time));
    } catch (err) {
      setMessage(err.response?.data?.message || t('booking.failed'));
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-[90vh] bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">{t('booking.title')}</h1>
          <p className="text-forest/60 mt-2">{t('booking.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-sage/10 shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium text-forest/80 mb-2">{t('booking.date_label')}</label>
            <div className="relative inline-block">
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all"
              />
            </div>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-12 bg-warm rounded-2xl border border-dashed border-sage/20">
              <svg className="w-12 h-12 text-forest/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-forest/60">{t('booking.no_slots')}</p>
              <p className="text-forest/50 text-sm mt-1">{t('booking.no_slots_hint')}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-forest/60 mb-3 font-medium">{t('booking.slots_available', { count: slots.length })}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-6">
                {slots.map((slot) => (
                  <button
                    key={slot.start_time}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-95 ${
                      selectedSlot?.start_time === slot.start_time
                        ? 'bg-forest text-white border-forest shadow-lg shadow-forest/20'
                        : 'bg-warm text-forest/70 border-sage/10 hover:border-sage/50 hover:shadow-md'
                    }`}
                  >
                    {slot.formatted}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedSlot && (
            <div className="bg-forest/10 border border-forest/20 rounded-xl p-4 mb-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-forest/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-forest/60">{t('booking.selected_time')}</p>
                  <p className="font-semibold text-forest">{selectedSlot.formatted}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-forest/80 mb-2">{t('booking.notes_label')} <span className="text-forest/40 font-normal">{t('booking.notes_optional')}</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all resize-none placeholder:text-forest/40"
              placeholder={t('booking.notes_placeholder')}
            />
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedSlot || loading}
            className="w-full bg-forest text-white py-3 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-lg hover:shadow-forest/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('booking.submit_loading')}
              </span>
            ) : t('booking.submit')}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in ${
              message === t('booking.success') ? 'bg-forest/10 border border-forest/20 text-forest' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                {message === t('booking.success') ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
