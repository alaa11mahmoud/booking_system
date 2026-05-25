import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

function ClockIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CoinIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

export default function PostsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const fetchPosts = () => {
    api.get('/cms/posts')
      .then((r) => setPosts(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    api.get('/cms/posts')
      .then((r) => setPosts(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (postId) => {
    if (!user) { navigate('/login'); return; }
    setSubscribing(postId);
    setSubscribeMsg('');
    try {
      await api.post(`/posts/${postId}/subscribe`);
      fetchPosts();
      setSubscribeMsg('تم الاشتراك بنجاح');
    } catch (err) {
      setSubscribeMsg(err.response?.data?.message || 'فشل الاشتراك');
    } finally {
      setSubscribing(null);
      setTimeout(() => setSubscribeMsg(''), 3000);
    }
  };

  const handleUnsubscribe = async (postId) => {
    if (!user) { navigate('/login'); return; }
    const post = posts.find(p => p.id === postId);
    if (!post?.subscription_id) return;
    setSubscribing(postId);
    setSubscribeMsg('');
    try {
      await api.delete(`/subscriptions/${post.subscription_id}`);
      fetchPosts();
      setSubscribeMsg('تم إلغاء الاشتراك');
    } catch (err) {
      setSubscribeMsg(err.response?.data?.message || 'فشل إلغاء الاشتراك');
    } finally {
      setSubscribing(null);
      setTimeout(() => setSubscribeMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    setConfirmDelete(null);
    try {
      await api.delete(`/cms/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      alert('فشل حذف المنشور');
    } finally {
      setDeleting(null);
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
    <div className="min-h-screen bg-cream py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <HeartIcon />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">منشورات د. هالة</h1>
          <p className="text-forest/60 mt-2">جلسات وبرامج وفعاليات</p>
        </div>

        {subscribeMsg && (
          <div className={`mb-6 p-4 rounded-xl text-sm text-center font-medium animate-fade-in ${
            subscribeMsg === 'تم الاشتراك بنجاح'
              ? 'bg-forest/10 border border-forest/20 text-forest'
              : 'bg-red-500/10 border border-red-500/20 text-red-600'
          }`}>
            {subscribeMsg}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-sage/10 shadow-sm">
            <p className="text-forest/40 text-lg">لا توجد منشورات حالياً</p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm overflow-hidden relative">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setConfirmDelete(post.id)}
                    disabled={deleting === post.id}
                    className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-md transition-all active:scale-90 disabled:opacity-50"
                  >
                    {deleting === post.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                  </button>
                )}
                {post.image_url && (
                  <div className="w-full bg-warm">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full object-cover max-h-96"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-forest mb-3">{post.title}</h2>

                  {post.start_date && post.end_date && (
                    <div className="flex items-center gap-2 bg-sage/10 border border-sage/20 rounded-xl px-4 py-3 mb-4">
                      <svg className="w-5 h-5 text-sage shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-forest font-medium text-sm">
                        {new Date(post.start_date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {' — '}
                        {new Date(post.end_date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  )}

                  <p className="text-forest/70 leading-relaxed whitespace-pre-line mb-5">{post.content}</p>

                  {(post.start_date || post.price || post.max_members) && (
                    <div className="flex flex-wrap gap-3 mb-5">
                      {post.start_date && post.end_date && (
                        <span className="inline-flex items-center gap-1.5 bg-sage/10 text-sage-dark px-3 py-1.5 rounded-full text-sm font-medium border border-sage/20">
                          <ClockIcon className="w-4 h-4" />
                          {post.start_date.substring(11, 16)} — {post.end_date.substring(11, 16)}
                        </span>
                      )}
                      {post.max_members && (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                          <UsersIcon className="w-4 h-4" />
                          {post.available_spots !== null && post.available_spots !== undefined
                            ? `${post.available_spots} / ${post.max_members} مقعد`
                            : `${post.max_members} مقعد`}
                        </span>
                      )}
                      {post.price !== null && post.price !== undefined && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200">
                          <CoinIcon className="w-4 h-4" />
                          {post.price} ج.م
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleSubscribe(post.id)}
                    disabled={subscribing === post.id || post.available_spots === 0 || post.is_subscribed}
                    className="w-full bg-forest text-white py-3 rounded-xl font-semibold hover:bg-forest-light transition-all active:scale-[0.99] shadow-md hover:shadow-forest/25 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribing === post.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        جاري...
                      </span>
                    ) : post.is_subscribed ? 'تم الحجز' : post.available_spots === 0 ? 'ممتلئ' : 'احجز الجلسة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 border border-sage/10 p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-forest mb-2">حذف المنشور</h3>
            <p className="text-forest/60 text-sm mb-6">هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting === confirmDelete}
                className="flex-1 bg-warm text-forest/80 py-2.5 rounded-xl text-sm font-medium hover:bg-sage/10 transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting === confirmDelete ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {deleting === confirmDelete ? 'جاري الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
