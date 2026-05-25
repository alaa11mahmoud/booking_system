import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function PlayIcon({ className = 'text-white' }) {
  return (
    <svg className={`w-6 h-6 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function VideosPage() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get('/cms/videos').then((r) => setVideos(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="max-w-6xl mx-auto animate-slide-up">
        <div className="text-center mb-14">
          <span className="text-sage font-medium text-sm tracking-widest uppercase">{t('videos.subtitle')}</span>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-forest mt-2">{t('videos.title')}</h1>
          <p className="text-forest/60 mt-2">{t('videos.description')}</p>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-forest/50">{t('videos.empty')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, idx) => {
              const youtubeId = getYoutubeId(video.video_url);
              const thumb = youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : video.cover_url || null;
              return (
                <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="relative h-48 bg-gradient-to-br from-sage/30 to-forest/30 overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayIcon className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    {video.file_url && thumb && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <a
                          href={video.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        >
                          <PlayIcon className="text-forest w-5 h-5" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-forest">{video.title}</h3>
                    {video.description && (
                      <p className="text-forest/60 text-sm mt-1 line-clamp-2">{video.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sage hover:text-sage-light font-medium transition-colors border border-sage/30 hover:border-sage/50 px-6 py-2.5 rounded-full hover:bg-sage/5"
          >
            <ChevronLeftIcon />
            {t('videos.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
