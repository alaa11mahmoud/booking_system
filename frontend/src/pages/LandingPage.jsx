import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import heroImg from '../assets/hero.png';
import VideoPlayerModal from '../components/VideoPlayerModal';

const INITIAL_VIDEOS = 3;

const STATS = [
  { value: '15+', label: 'سنوات الخبرة' },
  { value: '200+', label: 'فيديو تعليمي' },
  { value: '500+', label: 'استشارة ناجحة' },
];

const SUBSCRIPTIONS = [
  {
    title: 'اشتراك داخل مصر',
    description: 'متابعة دورية مع د. هالة للمرضى داخل مصر.',
    price: '200',
    currency: 'جنيه',
  },
  {
    title: 'اشتراك خارج مصر',
    description: 'متابعة دورية مع د. هالة للمرضى خارج مصر.',
    price: '50',
    currency: 'درهم',
  },
];

const SERVICES = [
  { icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'الاكتئاب وضغوطات الحياة', desc: 'مشاعر الحزن المستمر والضغط النفسي المستمر' },
  { icon: 'M9.5 14.5L16 8m0 0l-6-6m6 6H4', title: 'القلق والتوتر ونوبات الهلع', desc: 'الخوف الزايد والأفكار اللي بتجري في دماغك من غير سبب واضح' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'المشاكل الأسرية والعلاقات', desc: 'صعوبات التواصل مع شريك الحياة أو الأبناء أو أي علاقة مهمة بالنسبالك' },
  { icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z', title: 'اضطرابات النوم أو الأكل', desc: 'الأرق اللي مخليك تسهر أو تغيرات في الأكل بقى جزء من حياتك اليومية' },
];

const CAROUSEL_COLORS = ['#4a2c4a', '#c48a8a', '#3a3a3a', '#c47a5a', '#2d4c2d', '#8a6a4a', '#5a3a5a'];

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-reveal');
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

function SectionTitle({ subtitle, title, desc }) {
  return (
    <div className="text-center mb-14 scroll-reveal scroll-reveal-up">
      <span className="text-sage font-bold text-sm tracking-widest uppercase">{subtitle}</span>
      <h2 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">{title}</h2>
      {desc && <p className="text-forest/60 mt-3 max-w-xl mx-auto">{desc}</p>}
    </div>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`bg-forest/5 rounded-xl animate-pulse ${className}`} />;
}

function PlayIcon({ className = 'text-white' }) {
  return (
    <svg className={`w-6 h-6 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function VideoCard({ video, idx }) {
  const videoUrl = video.file_url || video.url || video.video_url;
  const youtubeId = getYoutubeId(videoUrl);
  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : video.cover_url || null;

  return (
    <div className="scroll-reveal scroll-reveal-up bg-cream rounded-2xl overflow-hidden shadow-sm card-hover" style={{ transitionDelay: `${idx * 100}ms` }}>
      <Link to="/videos" className="block">
        <div className="relative h-48 bg-gradient-to-br from-sage/30 to-forest/30 overflow-hidden">
          {thumb ? (
            <img src={thumb} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayIcon className="w-12 h-12 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer">
              <PlayIcon className="text-forest w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <h3 className="font-bold text-forest">{video.title}</h3>
        {video.description && (
          <p className="text-forest/60 text-sm mt-1 line-clamp-2">{video.description}</p>
        )}
      </div>
    </div>
  );
}

function CertificateCard({ cert, idx }) {
  const direction = idx % 2 === 0 ? 'scroll-reveal-right' : 'scroll-reveal-left';
  return (
    <div className={`scroll-reveal ${direction} bg-white rounded-2xl p-6 shadow-sm card-hover flex gap-5 items-start`} style={{ transitionDelay: `${idx * 120}ms` }}>
      <div className="w-20 h-20 rounded-xl bg-sage/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {cert.image_url ? (
          <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-forest text-base">{cert.title}</h3>
        <p className="text-sage text-sm">{cert.issuer || ''}</p>
        {cert.issue_date && <p className="text-coral text-xs mt-1">{new Date(cert.issue_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
        {cert.description && <p className="text-forest/70 text-sm mt-2 leading-relaxed">{cert.description}</p>}
      </div>
    </div>
  );
}

const SOCIAL_ICONS = {
  whatsapp: (
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  ),
  facebook: (
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  ),
  telegram: (
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  ),
  instagram: (
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  ),
  youtube: (
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  ),
  twitter: (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  ),
};

function SocialIcon({ platform, className = 'w-5 h-5' }) {
  const path = SOCIAL_ICONS[platform] || SOCIAL_ICONS.facebook;
  return (
    <svg className={`${className} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
      {path}
    </svg>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [about, setAbout] = useState(null);
  const [videos, setVideos] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [heroError, setHeroError] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setHeroError(false);
  }, [about?.image_url]);

  useScrollReveal();

  useEffect(() => {
    Promise.all([
      api.get('/cms/about').then((r) => setAbout(r.data)).catch(() => {}).finally(() => setAboutLoading(false)),
      api.get('/cms/videos').then((r) => setVideos(r.data)).catch(() => {}),
      api.get('/cms/certifications').then((r) => setCertifications(Array.isArray(r.data) ? r.data : [])).catch(() => {}),
      api.get('/cms/social-links').then((r) => setSocialLinks(Array.isArray(r.data) ? r.data : [])).catch(() => {}),
      api.get('/cms/testimonials').then((r) => setTestimonials(Array.isArray(r.data) ? r.data : [])).catch(() => {}),
      api.get('/cms/faqs').then((r) => setFaqs(Array.isArray(r.data) ? r.data : [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const isMobile = windowWidth < 768;
  const displayVideos = [...videos];
  if (videos.length > 0) {
    while (displayVideos.length < 8) {
      displayVideos.push(...videos);
    }
    if (displayVideos.length > 12) {
      displayVideos.length = 12;
    }
  }

  return (
    <div className="overflow-hidden bg-cream">
      {selectedVideo && (
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {/* ─── Hero ─── */}
      <section id="home" className="relative bg-forest min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-forest/90 to-forest" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-sage/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight mb-6">
                {about?.title || t('landing.fallback_title')}
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto lg:mr-0 mb-8">
                {about?.content || t('landing.fallback_content')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate(user ? '/book' : '/login')}
                  className="inline-flex items-center gap-2 bg-white text-forest px-8 py-3.5 rounded-full font-semibold hover:bg-white/90 transition-all active:scale-95 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('landing.book_btn')}
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all active:scale-95"
                >
                  {t('landing.signin_btn')}
                </Link>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-6">
                  {socialLinks.map((link) => {
                    const isInternal = link.url.startsWith('/');
                    const cls = "inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all active:scale-[0.98] shadow-md whitespace-nowrap";
                    return isInternal ? (
                      <Link key={link.id} to={link.url} className={cls}>
                        <SocialIcon platform={link.platform} className="w-5 h-5" />
                        {link.label}
                      </Link>
                    ) : (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={cls}>
                        <SocialIcon platform={link.platform} className="w-5 h-5" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              )}

              <p className="text-[#D4AF37] text-base md:text-lg mt-5 text-center lg:text-right font-semibold tracking-wide">
                <svg className="w-5 h-5 inline-block ml-1.5 -mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                متاح جلسات داخل و خارج مصر
              </p>
            </div>

            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-3 rounded-[40px] border border-sage/20 -rotate-2" />
                <div className="relative w-72 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem] rounded-[32px] overflow-hidden shadow-2xl animate-float">
                  {aboutLoading ? (
                    <div className="w-full h-full bg-forest/10" />
                  ) : (
                    <img src={heroError ? heroImg : (about?.image_url || heroImg)} alt="د. هالة" className="w-full h-full object-cover" onError={() => setHeroError(true)} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
                </div>
                <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-sage/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      {(about?.stats?.length > 0 ? about.stats : STATS).length > 0 && (
        <section className="relative z-10 pb-10 -mt-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border-2 border-sage/20 shadow-md p-8">
              <div className="grid grid-cols-3 divide-x divide-sage/20">
                {(about?.stats?.length > 0 ? about.stats : STATS).map((stat, idx) => (
                  <div key={idx} className="text-center scroll-reveal scroll-reveal-up" style={{ transitionDelay: `${idx * 100}ms` }}>
                    <div className="text-3xl md:text-4xl font-bold text-forest">{stat.value}</div>
                    <div className="text-sm text-coral font-bold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Services ─── */}
      <section id="services" className="py-16 md:py-20 px-4 bg-warm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 scroll-reveal scroll-reveal-up">
            <span className="text-sage font-bold text-sm tracking-widest uppercase">الخدمات</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">
              <span className="text-coral">الجلسات</span> التي نقدمها
            </h2>
            <p className="text-forest/60 mt-3 max-w-xl mx-auto">نساعدك على تخطي التحديات النفسية خطوه بخطوه</p>
          </div>

          <div className="space-y-5">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="scroll-reveal scroll-reveal-up bg-white rounded-2xl p-5 md:p-6 shadow-sm card-hover flex items-start gap-4 border border-sage/10" style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-forest text-base">{service.title}</h3>
                  <p className="text-forest/60 text-sm mt-1 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Video Library with 3D Carousel ─── */}
      <section id="library" className="py-16 md:py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 scroll-reveal scroll-reveal-up">
            <span className="text-sage font-bold text-sm tracking-widest uppercase">{t('landing.library_subtitle')}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">
              {t('landing.library_title_before')} <span className="text-coral">{t('landing.library_title_highlight')}</span>
            </h2>
            <p className="text-forest/60 mt-3 max-w-xl mx-auto">{t('landing.library_desc')}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-80">
              <Skeleton className="w-64 h-64 rounded-full" />
            </div>
          ) : displayVideos.length > 0 ? (
            <>
              <div className="relative scroll-reveal scroll-reveal-up overflow-visible py-0 spin-cylinder-container">
                <div className="relative flex items-center justify-center overflow-visible" style={{ height: isMobile ? `${380 + Math.max(0, displayVideos.length - 8) * 20}px` : `${520 + Math.max(0, displayVideos.length - 8) * 30}px` }}>
                  <div className="spin-cylinder-track">
                    {displayVideos.map((video, idx) => {
                      const N = displayVideos.length;
                      const angle = idx * (360 / N);
                      const baseRadius = isMobile ? 180 : 320;
                      const radius = N <= 8 ? baseRadius : baseRadius * Math.sin(Math.PI / 8) / Math.sin(Math.PI / N);

                      const videoUrl = video.file_url || video.url || video.video_url;
                      const youtubeId = getYoutubeId(videoUrl);
                      const thumb = youtubeId
                        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                        : video.cover_url || null;

                      const canPlay = !!videoUrl;

                      return (
                        <div
                          key={`${video.id}-${idx}`}
                          onClick={canPlay ? () => setSelectedVideo(video) : undefined}
                          className={`absolute left-1/2 top-1/2 flex-shrink-0 w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${canPlay ? 'cursor-pointer group hover:shadow-coral/20 hover:border hover:border-coral/30' : ''}`}
                          style={{
                            transform: `translate3d(-50%, -50%, 0) rotateY(${angle}deg) translateZ(${radius}px) rotateY(180deg)`,
                            zIndex: 10,
                          }}
                        >
                          <div className="w-full h-full" style={{ transform: 'scaleX(-1)' }}>
                            {thumb ? (
                              <img src={thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center" style={{ background: CAROUSEL_COLORS[idx % CAROUSEL_COLORS.length] }}>
                                <PlayIcon className="w-12 h-12 text-white/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                              <h3 className="text-white font-bold text-sm md:text-base leading-tight">{video.title}</h3>
                            </div>
                            {canPlay && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                  <PlayIcon className="text-forest w-5 h-5" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-16 mt-2.5 scroll-reveal scroll-reveal-up">
                {[
                  { title: t('landing.feature_1_title'), desc: t('landing.feature_1_desc') },
                  { title: t('landing.feature_2_title'), desc: t('landing.feature_2_desc') },
                  { title: t('landing.feature_3_title'), desc: t('landing.feature_3_desc') },
                ].map((feat, idx) => (
                  <div key={idx} className="text-center">
                    <h3 className="font-bold text-coral text-base">{feat.title}</h3>
                    <p className="text-black text-sm mt-4 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>

              {videos.length > INITIAL_VIDEOS && (
                <div className="text-center mt-12">
                  <Link
                    to="/videos"
                    className="inline-flex items-center gap-2 text-forest hover:text-forest-light font-medium transition-colors border border-sage/40 hover:border-sage px-6 py-2.5 rounded-full hover:bg-sage/5"
                  >
                    {t('landing.show_all', { count: videos.length })}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-forest/40 py-16">{t('landing.no_videos')}</p>
          )}
        </div>
      </section>

      {/* ─── Certifications ─── */}
      {certifications.length > 0 && (
        <section id="certifications" className="py-16 md:py-20 px-4 bg-cream">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14 scroll-reveal scroll-reveal-up">
              <span className="text-sage font-bold text-sm tracking-widest uppercase">{t('landing.certifications_subtitle')}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">
                {t('landing.certifications_title_before')} <span className="text-coral">{t('landing.certifications_title_highlight')}</span> {t('landing.certifications_title_after')}
              </h2>
              <p className="text-forest/60 mt-3 max-w-xl mx-auto">{t('landing.certifications_desc')}</p>
            </div>

            <div className="space-y-6">
              {certifications.map((cert, idx) => (
                <CertificateCard key={cert.id || idx} cert={cert} idx={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Testimonials ─── */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-16 md:py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 scroll-reveal scroll-reveal-up">
              <span className="text-sage font-bold text-sm tracking-widest uppercase">{t('landing.testimonials_subtitle')}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">
                {t('landing.testimonials_title_before')} <span className="text-coral">{t('landing.testimonials_title_highlight')}</span> {t('landing.testimonials_title_after')}
              </h2>
              <p className="text-forest/60 mt-3 max-w-xl mx-auto">{t('landing.testimonials_desc')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="scroll-reveal scroll-reveal-up bg-cream rounded-2xl shadow-sm card-hover pt-14 pb-8 px-6 text-center relative"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
                    {item.avatar_url ? (
                      <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-sage to-forest flex items-center justify-center text-white font-heading text-xl font-bold">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-forest text-lg">{item.name}</h3>
                  <p className="text-sage text-xs tracking-widest uppercase mt-1">{item.role}</p>
                  <p className="text-forest/70 text-sm mt-4 leading-relaxed italic">"{item.review}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Courses / Subscriptions ─── */}
      <section className="py-16 md:py-20 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            subtitle={t('landing.programs_subtitle')}
            title={t('landing.programs_title')}
            desc={t('landing.programs_desc')}
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {SUBSCRIPTIONS.map((sub, idx) => (
              <div
                key={sub.title}
                className="scroll-reveal scroll-reveal-up bg-white rounded-2xl p-8 shadow-sm card-hover"
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">{sub.title}</h3>
                <p className="text-forest/60 text-sm mb-5 leading-relaxed">{sub.description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-sage/10">
                  <span className="text-3xl font-bold text-forest">
                    {sub.price} <span className="text-base font-normal text-forest/50">{sub.currency}</span>
                  </span>
                  <button className="px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-light transition-all active:scale-95 shadow-sm">
                    {t('landing.subscribe')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      {faqs.length > 0 && (
        <section id="faq" className="py-16 md:py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14 scroll-reveal scroll-reveal-up">
              <span className="text-sage font-bold text-sm tracking-widest uppercase">الأسئلة</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">
                أسئلة <span className="text-coral">شائعة</span>
              </h2>
              <p className="text-forest/60 mt-3 max-w-xl mx-auto">إجابات لأكثر الأسئلة التي تهمك</p>
            </div>

            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <details key={item.id || idx} className="scroll-reveal scroll-reveal-up group bg-white rounded-2xl shadow-sm border border-sage/10 overflow-hidden" style={{ transitionDelay: `${idx * 80}ms` }}>
                  <summary className="cursor-pointer list-none flex items-center justify-between p-5 md:p-6 font-bold text-forest transition-colors">
                    {item.question}
                    <svg className="w-5 h-5 text-sage flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <p className="text-forest/60 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      <footer className="bg-forest text-white/70 border-t border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <span className="text-white font-heading text-lg">د</span>
            </div>
            <span className="text-white font-heading text-lg">{t('landing.footer_brand')}</span>
          </div>
          <p className="text-white/50">{t('landing.footer_copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-white/40 text-sm mt-4">
            صنع بواسطة{' '}
            <a
              href="https://www.facebook.com/teck.makers.2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage hover:text-sage-light transition-colors underline underline-offset-2"
            >
              TechMakers
            </a>
            {' '}لبناء الويبسايت الخاص بك
          </p>
        </div>
      </footer>
    </div>
  );
}
