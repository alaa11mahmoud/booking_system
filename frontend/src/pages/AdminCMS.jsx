import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';

export default function AdminCMS() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [about, setAbout] = useState({ title: '', content: '', image_url: '' });
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', start_date: '', end_date: '', start_time: '', end_time: '', price: '', max_members: '', image_url: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [saving, setSaving] = useState(false);
  const [initialAbout, setInitialAbout] = useState(null);
  const [dirtyIds, setDirtyIds] = useState(new Set());

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
    api.get('/cms/courses').then((r) => setCourses(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/videos').then((r) => setVideos(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/certifications').then((r) => setCertifications(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/posts').then((r) => setPosts(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/social-links').then((r) => setSocialLinks(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/testimonials').then((r) => setTestimonials(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/cms/faqs').then((r) => setFaqs(Array.isArray(r.data) ? r.data : [])).catch(() => {});
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

  const addCourse = async () => {
    try {
      const res = await api.post('/cms/courses', { title: 'New Course', description: '', price: 0, sort_order: courses.length + 1 });
      setCourses([...courses, res.data]);
      setMsg(t('admin_cms.success_course_added')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
  };

  const [savingId, setSavingId] = useState(null);

  const updateCourse = async (id, data) => {
    setSavingId(id);
    try {
      const res = await api.put(`/cms/courses/${id}`, data);
      setCourses(courses.map((c) => c.id === id ? res.data : c));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg(t('admin_cms.success_course_updated')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
    finally { setSavingId(null); }
  };

  const setCourseField = (id, field, value) => {
    setCourses(courses.map((c) => c.id === id ? { ...c, [field]: value } : c));
    setDirtyIds((prev) => { const n = new Set(prev); n.add(id); return n; });
  };

  const deleteCourse = async (id) => {
    try {
      await api.delete(`/cms/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg(t('admin_cms.success_course_deleted')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
  };

  const addVideo = async () => {
    try {
      const res = await api.post('/cms/videos', { title: 'New Video', file_url: '', description: '', sort_order: videos.length + 1 });
      setVideos([...videos, res.data]);
      setMsg(t('admin_cms.success_video_added')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
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

  const deleteVideo = async (id) => {
    try {
      await api.delete(`/cms/videos/${id}`);
      setVideos(videos.filter((v) => v.id !== id));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg(t('admin_cms.success_video_deleted')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
  };

  const addCertification = async () => {
    try {
      const res = await api.post('/cms/certifications', { title: 'شهادة جديدة', image_url: '', sort_order: certifications.length + 1 });
      setCertifications([...certifications, res.data]);
      setMsg(t('admin_cms.success_certification_added')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
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

  const deleteCertification = async (id) => {
    try {
      await api.delete(`/cms/certifications/${id}`);
      setCertifications(certifications.filter((c) => c.id !== id));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg(t('admin_cms.success_certification_deleted')); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || t('admin_cms.failed')); setMsgType('error'); }
  };

  const addPost = async () => {
    try {
      const payload = {
        title: newPost.title,
        content: newPost.content,
        start_date: `${newPost.start_date}T${newPost.start_time || '00:00'}`,
        end_date: `${newPost.end_date}T${newPost.end_time || '00:00'}`,
        price: newPost.price || undefined,
        max_members: parseInt(newPost.max_members),
        image_url: newPost.image_url || undefined,
        sort_order: posts.length + 1,
      };
      const res = await api.post('/cms/posts', payload);
      setPosts([...posts, res.data]);
      setNewPost({ title: '', content: '', start_date: '', end_date: '', start_time: '', end_time: '', price: '', max_members: '', image_url: '' });
      setMsg('تم إضافة المنشور'); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || 'فشل الإضافة'); setMsgType('error'); }
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

  const deletePost = async (id) => {
    try {
      await api.delete(`/cms/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
      setDirtyIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setMsg('تم حذف المنشور'); setMsgType('success');
    } catch (err) { setMsg(err.response?.data?.message || 'فشل الحذف'); setMsgType('error'); }
  };

  const TabButton = ({ tab, children }) => (
    <button
      onClick={() => switchTab(tab)}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        activeTab === tab
          ? 'bg-forest text-white shadow-sm'
          : 'bg-warm text-forest/60 hover:bg-sage/10 hover:text-forest'
      }`}
    >
      {children}
    </button>
  );

const today = new Date().toISOString().substring(0, 10);
  const inputClass = "w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all placeholder:text-forest/40";
  const btnClass = "bg-forest text-white px-6 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm";

  return (
    <div className="min-h-[90vh] bg-cream py-12 px-4">
      <div className="max-w-5xl mx-auto animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-forest">{t('admin_cms.title')}</h1>
          <p className="text-forest/60 mt-2">{t('admin_cms.subtitle')}</p>
        </div>

        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <TabButton tab="about">{t('admin_cms.tab_about')}</TabButton>
          <TabButton tab="courses">{t('admin_cms.tab_courses')}</TabButton>
          <TabButton tab="videos">{t('admin_cms.tab_videos')}</TabButton>
          <TabButton tab="certifications">{t('admin_cms.tab_certifications')}</TabButton>
          <TabButton tab="posts">المنشورات</TabButton>
          <TabButton tab="social">روابط التواصل</TabButton>
          <TabButton tab="testimonials">آراء العملاء</TabButton>
          <TabButton tab="faqs">الأسئلة الشائعة</TabButton>
        </div>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in ${
              msgType === 'success'
              ? 'bg-forest/10 border border-forest/20 text-forest'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {msg}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-sage/10 shadow-sm p-6 md:p-8 animate-fade-in">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1.5">{t('admin_cms.about_title')}</label>
                <input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1.5">{t('admin_cms.about_content')}</label>
                <textarea value={about.content} onChange={(e) => setAbout({ ...about, content: e.target.value })} rows={5} className={inputClass + ' resize-none'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest/70 mb-1.5">{t('admin_cms.about_image_url')}</label>
                <div className="flex gap-2">
                  <input value={about.image_url} onChange={(e) => setAbout({ ...about, image_url: e.target.value })} className={inputClass + ' flex-1'} />
                  <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
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

        {activeTab === 'courses' && (
          <div className="animate-fade-in">
            <button onClick={addCourse} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('admin_cms.add_course')}
            </button>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input value={course.title} onChange={(e) => setCourseField(course.id, 'title', e.target.value)}
                        className={inputClass} placeholder={t('admin_cms.course_title_placeholder')} />
                    </div>
                    <div className="md:col-span-2">
                      <textarea value={course.description || ''} onChange={(e) => setCourseField(course.id, 'description', e.target.value)}
                        className={inputClass + ' resize-none'} rows={2} placeholder={t('admin_cms.description_placeholder')} />
                    </div>
                    <input value={course.price} onChange={(e) => setCourseField(course.id, 'price', parseFloat(e.target.value) || 0)}
                      type="number" step="0.01" className={inputClass} placeholder={t('admin_cms.price_placeholder')} />
                    <div className="flex items-center gap-2">
                      <input value={course.image_url || ''} onChange={(e) => setCourseField(course.id, 'image_url', e.target.value)}
                        className={inputClass + ' flex-1'} placeholder={t('admin_cms.image_url_placeholder')} />
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                        {t('admin_cms.upload_image')}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          api.post('/upload', fd).then((res) => {
                            setCourseField(course.id, 'image_url', res.data.url);
                          }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                          e.target.value = '';
                        }} />
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-4.5 rounded-full transition-colors ${course.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={course.is_active} onChange={(e) => setCourseField(course.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${course.is_active ? 'translate-x-4.5' : ''}`} />
                        </div>
                        <span className="text-forest/50">Active</span>
                      </label>
                      <button onClick={() => updateCourse(course.id, course)} disabled={savingId === course.id || !dirtyIds.has(course.id)} className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(course.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === course.id ? t('admin_cms.save_loading') : t('admin_cms.save')}
                      </button>
                      <button onClick={() => deleteCourse(course.id)} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                        {t('admin_cms.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                <div key={cert.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="space-y-3">
                    <input value={cert.title} onChange={(e) => setCertField(cert.id, 'title', e.target.value)}
                      className={inputClass} placeholder={t('admin_cms.certification_title_placeholder')} />
                    <div className="flex items-center gap-4">
                      {cert.image_url && (
                        <img src={cert.image_url} alt={cert.title} className="w-20 h-20 object-contain rounded-xl border border-sage/10 bg-warm" />
                      )}
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-sage/20">
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-4.5 rounded-full transition-colors ${cert.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={cert.is_active} onChange={(e) => setCertField(cert.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${cert.is_active ? 'translate-x-4.5' : ''}`} />
                        </div>
                        <span className="text-forest/50">{t('admin_cms.active_label')}</span>
                      </label>
                      <button onClick={() => updateCertification(cert.id, cert)} disabled={savingId === cert.id || !dirtyIds.has(cert.id)} className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(cert.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === cert.id ? t('admin_cms.save_loading') : t('admin_cms.save')}
                      </button>
                      <button onClick={() => deleteCertification(cert.id)} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                        {t('admin_cms.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-sage/10 shadow-sm p-6 md:p-8 mb-6">
              <h3 className="text-lg font-bold text-forest mb-4">إضافة منشور جديد</h3>
              <div className="space-y-4">
                <input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className={inputClass} placeholder="عنوان المنشور" />
                <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className={inputClass + ' resize-none'} rows={3} placeholder="محتوى المنشور" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-1.5">تاريخ البداية</label>
                    <input value={newPost.start_date} onChange={(e) => setNewPost({ ...newPost, start_date: e.target.value })}
                      type="date" min={today} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-1.5">تاريخ النهاية</label>
                    <input value={newPost.end_date} onChange={(e) => setNewPost({ ...newPost, end_date: e.target.value })}
                      type="date" min={today} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-1.5">وقت البداية</label>
                    <input value={newPost.start_time} onChange={(e) => setNewPost({ ...newPost, start_time: e.target.value })}
                      type="time" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest/70 mb-1.5">وقت النهاية</label>
                    <input value={newPost.end_time} onChange={(e) => setNewPost({ ...newPost, end_time: e.target.value })}
                      type="time" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input value={newPost.price} onChange={(e) => setNewPost({ ...newPost, price: e.target.value })}
                    type="number" step="0.01" className={inputClass} placeholder="السعر" />
                  <input value={newPost.max_members} onChange={(e) => setNewPost({ ...newPost, max_members: e.target.value })}
                    type="number" className={inputClass} placeholder="عدد المقاعد" />
                </div>
                <div className="flex items-center gap-2">
                  <input value={newPost.image_url} onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                    className={inputClass + ' flex-1'} placeholder="رابط الصورة" />
                  <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
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
                <button onClick={addPost} disabled={!newPost.title || !newPost.content || !newPost.max_members || !newPost.start_date || !newPost.end_date || !newPost.start_time || !newPost.end_time}
                  className={btnClass + (!newPost.title || !newPost.content || !newPost.max_members || !newPost.start_date || !newPost.end_date || !newPost.start_time || !newPost.end_time ? ' opacity-50 cursor-not-allowed' : '')}>
                  إضافة المنشور
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input value={post.title} onChange={(e) => setPostField(post.id, 'title', e.target.value)}
                        className={inputClass} placeholder="عنوان المنشور" />
                    </div>
                    <div className="md:col-span-2">
                      <textarea value={post.content || ''} onChange={(e) => setPostField(post.id, 'content', e.target.value)}
                        className={inputClass + ' resize-none'} rows={3} placeholder="محتوى المنشور" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1.5">تاريخ البداية</label>
                        <input value={post.start_date ? post.start_date.substring(0, 10) : ''} onChange={(e) => setPostField(post.id, 'start_date', e.target.value + (post.start_date?.substring(10) || ''))}
                          type="date" min={today} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1.5">تاريخ النهاية</label>
                        <input value={post.end_date ? post.end_date.substring(0, 10) : ''} onChange={(e) => setPostField(post.id, 'end_date', e.target.value + (post.end_date?.substring(10) || ''))}
                          type="date" min={today} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1.5">وقت البداية</label>
                        <input value={post.start_date ? post.start_date.substring(11, 16) : ''} onChange={(e) => setPostField(post.id, 'start_date', (post.start_date?.substring(0, 11) || '') + e.target.value)}
                          type="time" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest/70 mb-1.5">وقت النهاية</label>
                        <input value={post.end_date ? post.end_date.substring(11, 16) : ''} onChange={(e) => setPostField(post.id, 'end_date', (post.end_date?.substring(0, 11) || '') + e.target.value)}
                          type="time" className={inputClass} />
                      </div>
                    </div>
                    <input value={post.price || ''} onChange={(e) => setPostField(post.id, 'price', parseFloat(e.target.value) || 0)}
                      type="number" step="0.01" className={inputClass} placeholder="السعر" />
                    <input value={post.max_members || ''} onChange={(e) => setPostField(post.id, 'max_members', parseInt(e.target.value) || null)}
                      type="number" className={inputClass} placeholder="عدد المقاعد" />
                    <div className="flex items-center gap-2">
                      <input value={post.image_url || ''} onChange={(e) => setPostField(post.id, 'image_url', e.target.value)}
                        className={inputClass + ' flex-1'} placeholder="رابط الصورة" />
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-4.5 rounded-full transition-colors ${post.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={post.is_active} onChange={(e) => setPostField(post.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${post.is_active ? 'translate-x-4.5' : ''}`} />
                        </div>
                        <span className="text-forest/50">نشط</span>
                      </label>
                      <button onClick={() => updatePost(post.id, post)} disabled={savingId === post.id || !dirtyIds.has(post.id)}
                        className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(post.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === post.id ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="animate-fade-in">
            <button onClick={async () => {
              try {
                const res = await api.post('/cms/social-links', { platform: 'whatsapp', label: 'رابط جديد', url: 'https://', sort_order: socialLinks.length + 1 });
                setSocialLinks([...socialLinks, res.data]);
                setMsg('تمت إضافة الرابط'); setMsgType('success');
              } catch (err) { setMsg(err.response?.data?.message || 'فشل الإضافة'); setMsgType('error'); }
            }} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة رابط
            </button>
            <div className="space-y-4">
              {socialLinks.map((link) => (
                <div key={link.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={link.platform} onChange={(e) => {
                      setSocialLinks(socialLinks.map((l) => l.id === link.id ? { ...l, platform: e.target.value } : l));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(link.id); return n; });
                    }} className="w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all">
                      <option value="whatsapp">واتساب</option>
                      <option value="facebook">فيسبوك</option>
                      <option value="telegram">تيليجرام</option>
                      <option value="instagram">انستغرام</option>
                      <option value="youtube">يوتيوب</option>
                      <option value="twitter">تويتر</option>
                      <option value="other">أخرى</option>
                    </select>
                    <input value={link.label} onChange={(e) => {
                      setSocialLinks(socialLinks.map((l) => l.id === link.id ? { ...l, label: e.target.value } : l));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(link.id); return n; });
                    }} className="w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all" placeholder="النص" />
                    <input value={link.url} onChange={(e) => {
                      setSocialLinks(socialLinks.map((l) => l.id === link.id ? { ...l, url: e.target.value } : l));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(link.id); return n; });
                    }} className="w-full bg-white border border-sage/20 rounded-xl px-4 py-2.5 text-forest focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all" placeholder="https://..." />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <div className={`relative w-9 h-4.5 rounded-full transition-colors ${link.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                        <input type="checkbox" checked={link.is_active} onChange={(e) => {
                          setSocialLinks(socialLinks.map((l) => l.id === link.id ? { ...l, is_active: e.target.checked } : l));
                          setDirtyIds((prev) => { const n = new Set(prev); n.add(link.id); return n; });
                        }} className="sr-only" />
                        <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${link.is_active ? 'translate-x-4.5' : ''}`} />
                      </div>
                      <span className="text-forest/50">نشط</span>
                    </label>
                    <button onClick={async () => {
                      setSavingId(link.id);
                      try {
                        const res = await api.put(`/cms/social-links/${link.id}`, link);
                        setSocialLinks(socialLinks.map((l) => l.id === link.id ? res.data : l));
                        setDirtyIds((prev) => { const n = new Set(prev); n.delete(link.id); return n; });
                        setMsg('تم تحديث الرابط'); setMsgType('success');
                      } catch (err) { setMsg(err.response?.data?.message || 'فشل التحديث'); setMsgType('error'); }
                      finally { setSavingId(null); }
                    }} disabled={savingId === link.id || !dirtyIds.has(link.id)}
                      className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(link.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                      {savingId === link.id ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                    <button onClick={async () => {
                      try {
                        await api.delete(`/cms/social-links/${link.id}`);
                        setSocialLinks(socialLinks.filter((l) => l.id !== link.id));
                        setDirtyIds((prev) => { const n = new Set(prev); n.delete(link.id); return n; });
                        setMsg('تم حذف الرابط'); setMsgType('success');
                      } catch (err) { setMsg(err.response?.data?.message || 'فشل الحذف'); setMsgType('error'); }
                    }} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="animate-fade-in">
            <button onClick={async () => {
              try {
                const res = await api.post('/cms/testimonials', { name: 'عميل جديد', review: 'نص التقييم', sort_order: testimonials.length + 1 });
                setTestimonials([...testimonials, res.data]);
                setMsg('تمت إضافة التقييم'); setMsgType('success');
              } catch (err) { setMsg(err.response?.data?.message || 'فشل الإضافة'); setMsgType('error'); }
            }} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة تقييم
            </button>
            <div className="space-y-4">
              {testimonials.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={item.name} onChange={(e) => {
                      setTestimonials(testimonials.map((t) => t.id === item.id ? { ...t, name: e.target.value } : t));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                    }} className={inputClass} placeholder="الاسم" />
                    <input value={item.role || ''} onChange={(e) => {
                      setTestimonials(testimonials.map((t) => t.id === item.id ? { ...t, role: e.target.value } : t));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                    }} className={inputClass} placeholder="الدور (اختياري)" />
                    <div className="md:col-span-2">
                      <textarea value={item.review} onChange={(e) => {
                        setTestimonials(testimonials.map((t) => t.id === item.id ? { ...t, review: e.target.value } : t));
                        setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                      }} className={inputClass + ' resize-none'} rows={3} placeholder="نص التقييم" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <div className={`relative w-9 h-4.5 rounded-full transition-colors ${item.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                        <input type="checkbox" checked={item.is_active} onChange={(e) => {
                          setTestimonials(testimonials.map((t) => t.id === item.id ? { ...t, is_active: e.target.checked } : t));
                          setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                        }} className="sr-only" />
                        <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${item.is_active ? 'translate-x-4.5' : ''}`} />
                      </div>
                      <span className="text-forest/50">نشط</span>
                    </label>
                    <button onClick={async () => {
                      setSavingId(item.id);
                      try {
                        const res = await api.put(`/cms/testimonials/${item.id}`, item);
                        setTestimonials(testimonials.map((t) => t.id === item.id ? res.data : t));
                        setDirtyIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
                        setMsg('تم تحديث التقييم'); setMsgType('success');
                      } catch (err) { setMsg(err.response?.data?.message || 'فشل التحديث'); setMsgType('error'); }
                      finally { setSavingId(null); }
                    }} disabled={savingId === item.id || !dirtyIds.has(item.id)}
                      className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(item.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                      {savingId === item.id ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                    <button onClick={async () => {
                      try {
                        await api.delete(`/cms/testimonials/${item.id}`);
                        setTestimonials(testimonials.filter((t) => t.id !== item.id));
                        setDirtyIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
                        setMsg('تم حذف التقييم'); setMsgType('success');
                      } catch (err) { setMsg(err.response?.data?.message || 'فشل الحذف'); setMsgType('error'); }
                    }} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="animate-fade-in">
            <button onClick={async () => {
              try {
                const res = await api.post('/cms/faqs', { question: 'سؤال جديد', answer: 'الإجابة', sort_order: faqs.length + 1 });
                setFaqs([...faqs, res.data]);
                setMsg('تمت إضافة السؤال'); setMsgType('success');
              } catch (err) { setMsg(err.response?.data?.message || 'فشل الإضافة'); setMsgType('error'); }
            }} className="mb-5 bg-forest text-white px-5 py-2.5 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md hover:shadow-forest/25 active:scale-[0.98] text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة سؤال
            </button>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="space-y-4">
                    <input value={item.question} onChange={(e) => {
                      setFaqs(faqs.map((f) => f.id === item.id ? { ...f, question: e.target.value } : f));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                    }} className={inputClass} placeholder="السؤال" />
                    <textarea value={item.answer} onChange={(e) => {
                      setFaqs(faqs.map((f) => f.id === item.id ? { ...f, answer: e.target.value } : f));
                      setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                    }} className={inputClass + ' resize-none'} rows={3} placeholder="الإجابة" />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <div className={`relative w-9 h-4.5 rounded-full transition-colors ${item.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                        <input type="checkbox" checked={item.is_active} onChange={(e) => {
                          setFaqs(faqs.map((f) => f.id === item.id ? { ...f, is_active: e.target.checked } : f));
                          setDirtyIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
                        }} className="sr-only" />
                        <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${item.is_active ? 'translate-x-4.5' : ''}`} />
                      </div>
                      <span className="text-forest/50">نشط</span>
                    </label>
                    <button onClick={async () => {
                      setSavingId(item.id);
                      try {
                        const res = await api.put(`/cms/faqs/${item.id}`, item);
                        setFaqs(faqs.map((f) => f.id === item.id ? res.data : f));
                        setDirtyIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
                        setMsg('تم تحديث السؤال'); setMsgType('success');
                      } catch (err) { setMsg(err.response?.data?.message || 'فشل التحديث'); setMsgType('error'); }
                      finally { setSavingId(null); }
                    }} disabled={savingId === item.id || !dirtyIds.has(item.id)}
                      className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(item.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                      {savingId === item.id ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                    <button onClick={async () => {
                      try {
                        await api.delete(`/cms/faqs/${item.id}`);
                        setFaqs(faqs.filter((f) => f.id !== item.id));
                        setDirtyIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
                        setMsg('تم حذف السؤال'); setMsgType('success');
                      } catch (err) { setMsg(err.response?.data?.message || 'فشل الحذف'); setMsgType('error'); }
                    }} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                <div key={video.id} className="bg-white rounded-2xl border border-sage/10 shadow-sm p-5 card-hover">
                  <div className="space-y-3">
                    <input value={video.title} onChange={(e) => setVideoField(video.id, 'title', e.target.value)}
                      className={inputClass} placeholder={t('admin_cms.video_title_placeholder')} />
                    <div className="flex items-center gap-2">
                      <input value={video.file_url || ''} onChange={(e) => setVideoField(video.id, 'file_url', e.target.value)}
                        className={inputClass + ' flex-1'} placeholder={t('admin_cms.video_file_url_placeholder')} />
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
                        {t('admin_cms.upload_video')}
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          api.post('/upload-video', fd).then((res) => {
                            setVideoField(video.id, 'file_url', res.data.url);
                          }).catch((err) => setMsg(err.response?.data?.message || t('admin_cms.failed')));
                          e.target.value = '';
                        }} />
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input value={video.cover_url || ''} onChange={(e) => setVideoField(video.id, 'cover_url', e.target.value)}
                        className={inputClass + ' flex-1'} placeholder="رابط صورة الغلاف" />
                      <label className="cursor-pointer bg-warm hover:bg-sage/10 text-forest/70 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-sage/20 whitespace-nowrap self-start">
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
                    {video.file_url && (
                      <video src={video.file_url} controls className="w-full max-h-48 rounded-xl" poster={video.cover_url || undefined} />
                    )}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <div className={`relative w-9 h-4.5 rounded-full transition-colors ${video.is_active ? 'bg-forest' : 'bg-forest/20'}`}>
                          <input type="checkbox" checked={video.is_active} onChange={(e) => setVideoField(video.id, 'is_active', e.target.checked)} className="sr-only" />
                          <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${video.is_active ? 'translate-x-4.5' : ''}`} />
                        </div>
                        <span className="text-forest/50">Active</span>
                      </label>
                      <button onClick={() => updateVideo(video.id, video)} disabled={savingId === video.id || !dirtyIds.has(video.id)} className={'bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest-light transition-all font-semibold shadow-md text-sm' + (dirtyIds.has(video.id) ? '' : ' opacity-50 cursor-not-allowed')}>
                        {savingId === video.id ? t('admin_cms.save_loading') : t('admin_cms.save')}
                      </button>
                      <button onClick={() => deleteVideo(video.id)} className="text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors ml-auto">
                        {t('admin_cms.delete')}
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
