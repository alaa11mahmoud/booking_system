import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/reset-password', {
        token,
        email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || t('reset_password.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-cream px-4 py-12">
        <div className="bg-white rounded-2xl border border-sage/10 p-8 shadow-sm max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{t('reset_password.error')}</p>
          <Link to="/forgot-password" className="text-sage hover:text-sage-light font-medium hover:underline transition-colors">
            {t('forgot_password.back_to_login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading font-black text-forest">{t('reset_password.title')}</h1>
          <p className="text-forest/60 mt-1">{t('reset_password.subtitle')}</p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('reset_password.password_label')}</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white border border-sage/20 rounded-xl pl-10 pr-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all placeholder:text-forest/40"
                  placeholder={t('reset_password.password_placeholder')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forest/80 mb-1.5">{t('reset_password.confirm_label')}</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password" required value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full bg-white border border-sage/20 rounded-xl pl-10 pr-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all placeholder:text-forest/40"
                  placeholder={t('reset_password.confirm_placeholder')}
                />
              </div>
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
                  {t('reset_password.submit_loading')}
                </span>
              ) : t('reset_password.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
