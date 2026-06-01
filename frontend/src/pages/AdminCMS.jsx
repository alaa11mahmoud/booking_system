import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function AdminCMS() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [about, setAbout] = useState({ title: '', content: '', image_url: '' });
  const [videos, setVideos] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const [newPost, setNewPost] = useState({ title: '', content: '', start_date: '', end_date: '', start_time: '', end_time: '', price: '', max_members: '', image_url: '', sort_order: 0, is_active: true });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [saving, setSaving] = useState(false);
  const [initialAbout, setInitialAbout] = useState(null);
  const [dirtyIds, setDirtyIds] = useState(new Set());
  const [confirm, setConfirm] = useState({ show: false, message: '', onConfirm: null });

  const showConfirm = (message, onConfirm) => {
    setConfirm({ show: true, message, onConfirm });
  };

  const isAboutDirty = initialAbout && (
    about.title !== initialAbout.title ||
    about.content !== initialAbout.content ||
    about.image_url !== initialAbout.image_url
  );

  const hasDirty = isAboutDirty || dirtyIds.size > 0;

  useEffect(() => {
    api.get('/cms/about').then((r) => {
      if (r.data) {
        const d = { title: r.data.title || '', content: r.data.content || '', image_url: r.data.image_url || '' };
        setAbout(d);
        setInitialAbout(d);
      }
    }).catch(() => {});
    api.get('/cms/videos').then((r) => setVideos(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/certifications').then((r) => setCertifications(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/posts').then((r) => setPosts(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  const switchTab = (tab) => {
    if (hasDirty) {
      if (!window.confirm(t('admin_cms.confirm_unsaved'))) return;
    }
    setActiveTab(tab);
  };

  const saveAbout = async () => {
    setSaving(true);
    try {
      await api.put('/cms/about', about);
      setInitialAbout({ ...about });
      setMsg(t('admin_cms.success_about')); setMsgType('success');
    } catch (err) {
      setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error');
    } finally { setSaving(false); }
  };

  const [savingId, setSavingId] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '', cover_url: '', description: '', sort_order: 0, is_active: true });
  const [creating, setCreating] = useState(false);

  const [showCertModal, setShowCertModal] = useState(false);
  const [newCert, setNewCert] = useState({ title: '', image_url: '', sort_order: 0, is_active: true });
  const [creatingCert, setCreatingCert] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  const addVideo = () => {
    setNewVideo({ title: '', url: '', cover_url: '', description: '', sort_order: videos.length + 1, is_active: true });
    setShowVideoModal(true);
  };

  const handleCreateVideo = async () => {
    if (!newVideo.title || !newVideo.url) return;
    try {
      new URL(newVideo.url);
    } catch {
      setMsg('رابط الفيديو غير صحيح'); setMsgType('error');
      return;
    }
    setCreating(true);
    try {
      const res = await api.post('/cms/videos', newVideo);
      setVideos([...videos, res.data]);
      setShowVideoModal(false);
      setMsg(t('admin_cms.success_video_added')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    finally { setCreating(false); }
  };

  const updateVideo = async (id, data) => {
    setSavingId(id);
    try {
      const res = await api.put(`/cms/videos/${id}`, data);
      setVideos(videos.map((v) => v.id === id ? res.data : v));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg(t('admin_cms.success_video_updated')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    finally { setSavingId(null); }
  };

  const setVideoField = (id, field, value) => {
    setVideos(videos.map((v) => v.id === id ? { ...v, [field]: value } : v));
    setDirtyIds((prev) => { const n = new Set(prev); n.add(id); return n; });
  };

  const deleteVideo = (id) => {
    showConfirm('هل أنت متأكد من حذف هذا الفيديو؟', async () => {
      try {
        await api.delete(`/cms/videos/${id}`);
        setVideos(videos.filter((v) => v.id !== id));
        setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setMsg(t('admin_cms.success_video_deleted')); setMsgType('success');
      } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    });
  };

  const addCertification = () => {
    setNewCert({ title: '', image_url: '', sort_order: certifications.length + 1, is_active: true });
    setShowCertModal(true);
  };

  const updateCertification = async (id, data) => {
    setSavingId(id);
    try {
      const res = await api.put(`/cms/certifications/${id}`, data);
      setCertifications(certifications.map((c) => c.id === id ? res.data : c));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg(t('admin_cms.success_certification_updated')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    finally { setSavingId(null); }
  };

  const setCertField = (id, field, value) => {
    setCertifications(certifications.map((c) => c.id === id ? { ...c, [field]: value } : c));
    setDirtyIds((prev) => { const n = new Set(prev); n.add(id); return n; });
  };

  const deleteCertification = (id) => {
    showConfirm('هل أنت متأكد من حذف هذه الشهادة؟', async () => {
      try {
        await api.delete(`/cms/certifications/${id}`);
        setCertifications(certifications.filter((c) => c.id !== id));
        setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setMsg(t('admin_cms.success_certification_deleted')); setMsgType('success');
      } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    });
  };

  const addPost = () => {
    setNewPost({ title: '', content: '', start_date: '', end_date: '', start_time: '', end_time: '', price: '', max_members: '', image_url: '', sort_order: posts.length + 1, is_active: true });
    setShowPostModal(true);
  };

  const updatePost = async (id, data) => {
    setSavingId(id);
    try {
      const res = await api.put(`/cms/posts/${id}`, data);
      setPosts(posts.map((p) => p.id === id ? res.data : p));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg('تم تحديث المنشور'); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || 'فشل التحديث'); setMsgType('error'); }
    finally { setSavingId(null); }
  };

  const setPostField = (id, field, value) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, [field]: value } : p));
    setDirtyIds((prev) => { const n = new Set(prev); n.add(id); return n; });
  };

  const handleCreateCertification = async () => {
    if (!newCert.title) return;
    setCreatingCert(true);
    try {
      const res = await api.post('/cms/certifications', newCert);
      setCertifications([...certifications, res.data]);
      setShowCertModal(false);
      setMsg(t('admin_cms.success_certification_added')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    finally { setCreatingCert(false); }
  };

  const deletePost = (id) => {
    showConfirm('هل أنت متأكد من حذف هذا المنشور؟', async () => {
      try {
        await api.delete(`/cms/posts/${id}`);
        setPosts(posts.filter((p) => p.id !== id));
        setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setMsg('تم حذف المنشور'); setMsgType('success');
      } catch (err) { setMsg(err.response?.data?.message || 'فشل الحذف'); setMsgType('error'); }
    });
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.max_members || !newPost.start_date || !newPost.end_date || !newPost.start_time || !newPost.end_time) return;
    setCreatingPost(true);
    try {
      const payload = {
        title: newPost.title,
        content: newPost.content,
        start_date: `${newPost.start_date}T${newPost.start_time || '00:00'}`,
        end_date: `${newPost.end_date}T${newPost.end_time || '00:00'}`,
        price: newPost.price || undefined,
        max_members: parseInt(newPost.max_members),
        image_url: newPost.image_url || undefined,
        sort_order: newPost.sort_order,
        is_active: newPost.is_active,
      };
      const res = await api.post('/cms/posts', payload);
      setPosts([...posts, res.data]);
      setShowPostModal(false);
      setMsg('تم إضافة المنشور'); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || 'فشل الإضافة'); setMsgType('error'); }
    finally { setCreatingPost(false); }
  };

  const TabButton = ({ tab, children }) => (
    <button
      onClick={() => switchTab(tab)}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        activeTab === tab
          ? 'bg-forest text-white shadow-sm'
          : 'bg-warm text-forest hover:bg-sage/10 hover:text-forest'
      }`}
    >
      {children}
    </button>
  );

const today = new Date().toISOString().substring(0, 10);
  const inputClass = "w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all placeholder:text-forest";
  const btnClass = "bg-forest text-white px-6 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm";

  return (
    <div className="min-h-[90vh] bg-cream py-12 px-4">
      <div className="max-w-5xl mx-auto animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <img src="/logo-new.png" alt="د. هالة" className="h-8 w-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">{t('admin_cms.title')}</h1>
          <p className="text-forest mt-2">{t('admin_cms.subtitle')}</p>
        </div>

        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <TabButton tab="about">{t('admin_cms.tab_about')}</TabButton>
          <TabButton tab="videos">{t('admin_cms.tab_videos')}</TabButton>
          <TabButton tab="certifications">{t('admin_cms.tab_certifications')}</TabButton>
          <TabButton tab="posts">المنشورات</TabButton>
        </div>

        {msg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setMsg(''); setMsgType('success'); }}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm mx-4 animate-slide-up text-center" onClick={(e) => e.stopPropagation()}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                msgType === 'success' ? 'bg-forest/10' : 'bg-red-500/10'
              }`}>
                <svg className={`w-7 h-7 ${msgType === 'success' ? 'text-forest' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  {msgType === 'success' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <p className={`text-base font-semibold ${msgType === 'success' ? 'text-forest' : 'text-red-600'}`}>{msg}</p>
              <button onClick={() => { setMsg(''); setMsgType('success'); }}
                className="mt-5 bg-forest text-white px-6 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold text-sm w-full">
                حسناً
              </button>
            </div>
          </div>
        )}

        {confirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setConfirm({ show: false, message: '', onConfirm: null })}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm mx-4 animate-slide-up text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-forest mb-6">{confirm.message}</p>
              <div className="flex gap-3">
                <button onClick={() => { confirm.onConfirm(); setConfirm({ show: false, message: '', onConfirm: null }); }}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-xl hover:bg-red-600 transition-all font-semibold text-sm flex-1">
                  حذف
                </button>
                <button onClick={() => setConfirm({ show: false, message: '', onConfirm: null })}
                  className="bg-warm text-forest px-6 py-2.5 rounded-xl hover:bg-sage/10 transition-all font-semibold text-sm flex-1">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-sage/10 shadow-sm p-6 md:p-8 animate-fade-in">
            <div className="space-y-5">
              <div>
                <label className="block text-base font-bold text-forest mb-1.5">{t('admin_cms.about_title')}</label>
                <input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-base font-bold text-forest mb-1.5">{t('admin_cms.about_content')}</label>
                <textarea value={about.content} onChange={(e) => setAbout({ ...about, content: e.target.value })} rows={5} className={inputClass + ' resize-none'} />
              </div>
              <div>
                <label className="block text-base font-bold text-forest mb-1.5">{t('admin_cms.about_image_url')}</label>
                <div className="flex gap-2">
                  <input value={about.image_url} onChange={(e) => setAbout({ ...about, image_url: e.target.value })} className={inputClass + ' flex-1'} />
                  <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                    {t('admin_cms.upload_image')}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      api.post('/upload', fd).then((res) => {
                        setAbout({ ...about, image_url: res.data.url });
                        setMsg(t('admin_cms.success_upload'));
                      }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                      e.target.value = '';
                    }} />
                  </label>
                </div>
              </div>
              <button onClick={saveAbout} disabled={saving || !isAboutDirty} className={btnClass + (isAboutDirty ? '' : ' opacity-50 cursor-not-allowed')}>
                {saving ? t('admin_cms.save_loading') : t('admin_cms.save_about')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="animate-fade-in">
            <button onClick={addCertification} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('admin_cms.add_certification')}
            </button>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover relative">
                  <button onClick={() => deleteCertification(cert.id)} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-forest mb-1.5">{t('admin_cms.certification_title_placeholder')}</label>
                    <input value={cert.title} onChange={(e) => setCertField(cert.id, 'title', e.target.value)}
                      className={inputClass} />
                    <div className="flex items-center gap-4">
                      {cert.image_url && (
                        <img src={cert.image_url} alt={cert.title} className="w-20 h-20 object-contain rounded-xl border border-sage/10 bg-warm" />
                      )}
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-sage/20">
                        {t('admin_cms.upload_image')}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          api.post('/upload', fd).then((res) => {
                            setCertField(cert.id, 'image_url', res.data.url);
                          }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                          e.target.value = '';
                        }} />
                      </label>
                      {cert.image_url && (
                        <button onClick={() => setCertField(cert.id, 'image_url', '')}
                          className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
                          {t('admin_cms.remove_image')}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-base font-bold text-forest">الترتيب:</label>
                      <input value={cert.sort_order ?? 0} onChange={(e) => setCertField(cert.id, 'sort_order', parseInt(e.target.value) || 0)}
                        type="number" className={inputClass + ' w-24'} min="0" />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-[18px] rounded-full transition-colors ${cert.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={cert.is_active} onChange={(e) => setCertField(cert.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${cert.is_active ? 'translate-x-[18px]' : ''}`} />
                        </div>
                        <span className="text-forest">{t('admin_cms.active_label')}</span>
                      </label>
                      <button onClick={() => updateCertification(cert.id, cert)} disabled={savingId === cert.id || !dirtyIds.has(cert.id)} className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(cert.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === cert.id ? t('admin_cms.save_loading') : t('admin_cms.save')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showCertModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCertModal(false)}>
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-forest mb-5">إضافة شهادة جديدة</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">عنوان الشهادة</label>
                      <input value={newCert.title} onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">صورة الشهادة</label>
                      <div className="flex items-center gap-2">
                        <input value={newCert.image_url} onChange={(e) => setNewCert({ ...newCert, image_url: e.target.value })}
                          className={inputClass + ' flex-1'} dir="ltr" />
                        <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                          رفع صورة
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            api.post('/upload', fd).then((res) => {
                              setNewCert({ ...newCert, image_url: res.data.url });
                            }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                            e.target.value = '';
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">الترتيب</label>
                      <input value={newCert.sort_order} onChange={(e) => setNewCert({ ...newCert, sort_order: parseInt(e.target.value) || 0 })}
                        type="number" className={inputClass + ' w-24'} min="0" />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">الحالة</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-[18px] rounded-full transition-colors ${newCert.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={newCert.is_active} onChange={(e) => setNewCert({ ...newCert, is_active: e.target.checked })} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${newCert.is_active ? 'translate-x-[18px]' : ''}`} />
                        </div>
                        <span className="text-forest">نشط</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleCreateCertification} disabled={creatingCert || !newCert.title}
                        className={'bg-forest text-white px-6 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm flex-1' + ((creatingCert || !newCert.title) ? ' opacity-50 cursor-not-allowed' : '')}>
                        {creatingCert ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                      <button onClick={() => setShowCertModal(false)}
                        className="bg-warm text-forest px-6 py-2.5 rounded-xl hover:bg-sage/10 transition-all font-semibold text-sm">
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="animate-fade-in">
            <button onClick={addPost} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة منشور
            </button>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover relative">
                  <button onClick={() => deletePost(post.id)} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-base font-bold text-forest mb-1.5">عنوان المنشور</label>
                      <input value={post.title} onChange={(e) => setPostField(post.id, 'title', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-base font-bold text-forest mb-1.5">محتوى المنشور</label>
                      <textarea value={post.content || ''} onChange={(e) => setPostField(post.id, 'content', e.target.value)}
                        className={inputClass + ' resize-none'} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">تاريخ البداية</label>
                        <input value={post.start_date ? post.start_date.substring(0, 10) : ''} onChange={(e) => setPostField(post.id, 'start_date', e.target.value + (post.start_date?.substring(10) || ''))}
                          type="date" min={today} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">تاريخ النهاية</label>
                        <input value={post.end_date ? post.end_date.substring(0, 10) : ''} onChange={(e) => setPostField(post.id, 'end_date', e.target.value + (post.end_date?.substring(10) || ''))}
                          type="date" min={today} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">وقت البداية</label>
                        <input value={post.start_date ? post.start_date.substring(11, 16) : ''} onChange={(e) => setPostField(post.id, 'start_date', (post.start_date?.substring(0, 11) || '') + e.target.value)}
                          type="time" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">وقت النهاية</label>
                        <input value={post.end_date ? post.end_date.substring(11, 16) : ''} onChange={(e) => setPostField(post.id, 'end_date', (post.end_date?.substring(0, 11) || '') + e.target.value)}
                          type="time" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">السعر</label>
                      <input value={post.price || ''} onChange={(e) => setPostField(post.id, 'price', parseFloat(e.target.value) || 0)}
                        type="number" step="0.01" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">عدد المقاعد</label>
                      <input value={post.max_members || ''} onChange={(e) => setPostField(post.id, 'max_members', parseInt(e.target.value) || null)}
                        type="number" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-base font-bold text-forest mb-1.5">صورة المنشور</label>
                      <div className="flex items-center gap-2">
                        <input value={post.image_url || ''} onChange={(e) => setPostField(post.id, 'image_url', e.target.value)}
                          className={inputClass + ' flex-1'} />
                        <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                          رفع صورة
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            api.post('/upload', fd).then((res) => {
                              setPostField(post.id, 'image_url', res.data.url);
                            }).catch((err) => setMsg(err.response?.data?.message || 'فشل الرفع'));
                            e.target.value = '';
                          }} />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <label className="text-base font-bold text-forest">الترتيب:</label>
                      <input value={post.sort_order ?? 0} onChange={(e) => setPostField(post.id, 'sort_order', parseInt(e.target.value) || 0)}
                        type="number" className={inputClass + ' w-24'} min="0" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-[18px] rounded-full transition-colors ${post.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={post.is_active} onChange={(e) => setPostField(post.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${post.is_active ? 'translate-x-[18px]' : ''}`} />
                        </div>
                        <span className="text-forest">نشط</span>
                      </label>
                      <button onClick={() => updatePost(post.id, post)} disabled={savingId === post.id || !dirtyIds.has(post.id)}
                        className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(post.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === post.id ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showPostModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowPostModal(false)}>
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-forest mb-5">إضافة منشور جديد</h3>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">عنوان المنشور</label>
                      <input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">محتوى المنشور</label>
                      <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        className={inputClass + ' resize-none'} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">تاريخ البداية</label>
                        <input value={newPost.start_date} onChange={(e) => setNewPost({ ...newPost, start_date: e.target.value })}
                          type="date" min={today} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">تاريخ النهاية</label>
                        <input value={newPost.end_date} onChange={(e) => setNewPost({ ...newPost, end_date: e.target.value })}
                          type="date" min={today} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">وقت البداية</label>
                        <input value={newPost.start_time} onChange={(e) => setNewPost({ ...newPost, start_time: e.target.value })}
                          type="time" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">وقت النهاية</label>
                        <input value={newPost.end_time} onChange={(e) => setNewPost({ ...newPost, end_time: e.target.value })}
                          type="time" className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">السعر</label>
                        <input value={newPost.price} onChange={(e) => setNewPost({ ...newPost, price: e.target.value })}
                          type="number" step="0.01" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-forest mb-1.5">عدد المقاعد</label>
                        <input value={newPost.max_members} onChange={(e) => setNewPost({ ...newPost, max_members: e.target.value })}
                          type="number" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">صورة المنشور</label>
                      <div className="flex items-center gap-2">
                        <input value={newPost.image_url} onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                          className={inputClass + ' flex-1'} dir="ltr" />
                        <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                          رفع صورة
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            api.post('/upload', fd).then((res) => {
                              setNewPost({ ...newPost, image_url: res.data.url });
                            }).catch((err) => setMsg(err.response?.data?.message || 'فشل الرفع'));
                            e.target.value = '';
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">الترتيب</label>
                      <input value={newPost.sort_order} onChange={(e) => setNewPost({ ...newPost, sort_order: parseInt(e.target.value) || 0 })}
                        type="number" className={inputClass + ' w-24'} min="0" />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">الحالة</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-[18px] rounded-full transition-colors ${newPost.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={newPost.is_active} onChange={(e) => setNewPost({ ...newPost, is_active: e.target.checked })} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${newPost.is_active ? 'translate-x-[18px]' : ''}`} />
                        </div>
                        <span className="text-forest">نشط</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleCreatePost} disabled={creatingPost || !newPost.title || !newPost.content || !newPost.max_members || !newPost.start_date || !newPost.end_date || !newPost.start_time || !newPost.end_time}
                        className={'bg-forest text-white px-6 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm flex-1' + ((creatingPost || !newPost.title || !newPost.content || !newPost.max_members || !newPost.start_date || !newPost.end_date || !newPost.start_time || !newPost.end_time) ? ' opacity-50 cursor-not-allowed' : '')}>
                        {creatingPost ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                      <button onClick={() => setShowPostModal(false)}
                        className="bg-warm text-forest px-6 py-2.5 rounded-xl hover:bg-sage/10 transition-all font-semibold text-sm">
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="animate-fade-in">
            <button onClick={addVideo} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('admin_cms.add_video')}
            </button>
            <div className="space-y-4">
              {videos.map((video) => {
                return (
                <div key={video.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover relative">
                  <button onClick={() => deleteVideo(video.id)} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="space-y-3">
                    <label className="block text-base font-bold text-forest mb-1.5">عنوان الفيديو</label>
                    <input value={video.title} onChange={(e) => setVideoField(video.id, 'title', e.target.value)}
                      className={inputClass} />
                    <label className="block text-base font-bold text-forest mb-1.5">رابط الفيديو</label>
                    <input value={video.url || ''} onChange={(e) => setVideoField(video.id, 'url', e.target.value)}
                      className={inputClass} dir="ltr" />
                    <label className="block text-base font-bold text-forest mb-1.5">صورة الغلاف</label>
                    <div className="flex items-center gap-2">
                      <input value={video.cover_url || ''} onChange={(e) => setVideoField(video.id, 'cover_url', e.target.value)}
                        className={inputClass + ' flex-1'} />
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                        رفع غلاف
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          api.post('/upload', fd).then((res) => {
                            setVideoField(video.id, 'cover_url', res.data.url);
                          }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                          e.target.value = '';
                        }} />
                      </label>
                    </div>
                    <label className="block text-base font-bold text-forest mb-1.5">وصف الفيديو</label>
                    <textarea value={video.description || ''} onChange={(e) => setVideoField(video.id, 'description', e.target.value)}
                      className={inputClass + ' resize-none'} rows={2} />
                    {video.url && (
                      <video src={video.url} controls className="w-full max-h-48 rounded-xl" poster={video.cover_url || undefined} />
                    )}
                    <div className="flex items-center gap-2">
                      <label className="text-base font-bold text-forest">الترتيب:</label>
                      <input value={video.sort_order ?? 0} onChange={(e) => setVideoField(video.id, 'sort_order', parseInt(e.target.value) || 0)}
                        type="number" className={inputClass + ' w-24'} min="0" />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-[18px] rounded-full transition-colors ${video.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={video.is_active} onChange={(e) => setVideoField(video.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${video.is_active ? 'translate-x-[18px]' : ''}`} />
                        </div>
                        <span className="text-forest">Active</span>
                      </label>
                      <button onClick={() => updateVideo(video.id, video)} disabled={savingId === video.id || !dirtyIds.has(video.id)} className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(video.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === video.id ? t('admin_cms.save_loading') : t('admin_cms.save')}
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {showVideoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowVideoModal(false)}>
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-forest mb-5">إضافة فيديو جديد</h3>
                  <div className="space-y-4">
                    {msg && msgType === 'error' && (
                      <div className="p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-600">
                        {msg}
                      </div>
                    )}
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">عنوان الفيديو</label>
                      <input value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">رابط الفيديو</label>
                      <input value={newVideo.url} onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                        className={inputClass} dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">صورة الغلاف</label>
                      <div className="flex items-center gap-2">
                        <input value={newVideo.cover_url} onChange={(e) => setNewVideo({ ...newVideo, cover_url: e.target.value })}
                          className={inputClass + ' flex-1'} dir="ltr" />
                        <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                          رفع صورة
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            api.post('/upload', fd).then((res) => {
                              setNewVideo({ ...newVideo, cover_url: res.data.url });
                            }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                            e.target.value = '';
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">وصف الفيديو</label>
                      <textarea value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        className={inputClass + ' resize-none'} rows={2} />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">الترتيب</label>
                      <input value={newVideo.sort_order} onChange={(e) => setNewVideo({ ...newVideo, sort_order: parseInt(e.target.value) || 0 })}
                        type="number" className={inputClass + ' w-24'} min="0" />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-forest mb-1.5">الحالة</label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-[18px] rounded-full transition-colors ${newVideo.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={newVideo.is_active} onChange={(e) => setNewVideo({ ...newVideo, is_active: e.target.checked })} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${newVideo.is_active ? 'translate-x-[18px]' : ''}`} />
                        </div>
                        <span className="text-forest">نشط</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleCreateVideo} disabled={creating || !newVideo.title || !newVideo.url}
                        className={'bg-forest text-white px-6 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm flex-1' + ((creating || !newVideo.title || !newVideo.url) ? ' opacity-50 cursor-not-allowed' : '')}>
                        {creating ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                      <button onClick={() => setShowVideoModal(false)}
                        className="bg-warm text-forest px-6 py-2.5 rounded-xl hover:bg-sage/10 transition-all font-semibold text-sm">
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
