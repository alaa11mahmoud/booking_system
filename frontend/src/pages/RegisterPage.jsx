import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat().join(', ') || t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  const inputClass = "w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all placeholder:text-forest/40";

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading font-black text-forest">{t('register.title')}</h1>
          <p className="text-forest/60 mt-1">{t('register.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-sage/10 p-8 shadow-sm">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-fade-in">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('register.name_label')}</label>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder={t('register.name_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('register.email_label')}</label>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} placeholder={t('register.email_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('register.password_label')}</label>
              <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} className={inputClass} placeholder={t('register.password_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('register.confirm_label')}</label>
              <input type="password" required value={form.password_confirmation} onChange={(e) => update('password_confirmation', e.target.value)} className={inputClass} placeholder={t('register.confirm_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('register.phone_label')}</label>
              <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} placeholder={t('register.phone_placeholder')} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-lg hover:shadow-forest/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('register.submit_loading')}
                </span>
              ) : t('register.submit')}
            </button>
          </form>

          <p className="text-center text-sm text-forest/60 mt-6">
            {t('register.prompt')}{' '}
            <Link to="/login" className="text-sage hover:text-sage-light font-medium hover:underline transition-colors">
              {t('register.prompt_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
