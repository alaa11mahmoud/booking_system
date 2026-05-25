import { useEffect, useRef } from 'react';

function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function VideoPlayerModal({ video, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const youtubeId = getYoutubeId(video.file_url || video.url);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {youtubeId ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : video.file_url ? (
          <video
            src={video.file_url}
            controls
            autoPlay
            className="w-full max-h-[80vh]"
            poster={video.cover_url || undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-white/50">
            لا يمكن تشغيل هذا الفيديو
          </div>
        )}

        <div className="bg-black/80 p-6">
          <h3 className="text-white font-bold text-lg">{video.title}</h3>
          {video.description && (
            <p className="text-white/60 text-sm mt-1">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
