import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getVideos,
  getYouTubeEmbedUrl,
  getTikTokEmbedUrl,
  getInstagramEmbedUrl,
  type VideoItem,
} from "../data";
import { useLanguage } from "../language";

const mono = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px" as const,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#999",
};

const serif = {
  fontFamily: "'Cormorant Garamond', serif",
};

function getVideoPreviewUrl(video: VideoItem): string {
  if (video.thumbnail) return video.thumbnail;

  if (video.source === "youtube") {
    const match = video.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }

  return "";
}

function getVideoAspectRatio(video: VideoItem): string {
  const isVertical = video.orientation === "vertical";
  const isSquare = video.orientation === "square";

  if (isVertical) return video.featured ? "9/15" : "9/16";
  if (isSquare) return "1/1";
  return video.featured ? "4/3" : "16/9";
}

function getVideoSourceLabel(video: VideoItem): string {
  if (video.source === "youtube") return "YOUTUBE";
  if (video.source === "instagram") return "INSTAGRAM";
  if (video.source === "tiktok") return "TIKTOK";
  return "VIDEO";
}

/* ---- Single Video Card (masonry-friendly) ---- */
function VideoCard({ video, index, onSelect }: { video: VideoItem; index: number; onSelect?: (video: VideoItem) => void }) {
  const previewUrl = getVideoPreviewUrl(video);
  const aspectRatio = getVideoAspectRatio(video);
  const sourceLabel = getVideoSourceLabel(video);
  const captionPreview = video.caption.length > 96 ? `${video.caption.slice(0, 96)}...` : video.caption;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className={`bento-item ori-${video.orientation} video-card-group`}
      style={{
        display: "flex",
        flexDirection: "column",
        breakInside: "avoid",
        marginBottom: "24px",
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={() => onSelect?.(video)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: aspectRatio,
          overflow: "hidden",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
          borderRadius: "18px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={video.caption}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "scale(1.01)",
            }}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(145deg, rgba(192,93,93,0.35), rgba(201,139,63,0.25))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.18) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            ...mono,
            fontSize: "7px",
            padding: "4px 8px",
            backgroundColor: "rgba(0,0,0,0.52)",
            color: "#fff",
            backdropFilter: "blur(6px)",
            borderRadius: "999px",
            letterSpacing: "0.14em",
          }}
        >
          {sourceLabel}
        </div>

        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            ...mono,
            fontSize: "7px",
            padding: "4px 8px",
            background: "rgba(255,255,255,0.88)",
            color: "#1a1a1a",
            borderRadius: "999px",
          }}
        >
          {video.featured ? "Featured" : "Preview"}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.35s ease",
            background: "rgba(0,0,0,0.18)",
          }}
          className="video-card-play-overlay"
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c05d5d, #d48a6a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(192, 93, 93, 0.35)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {video.caption && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "28px 16px 14px",
              background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.86) 100%)",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            {captionPreview}
          </div>
        )}
      </div>

      {/* Caption */}
      {video.caption && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(12px, 1.4vw, 14px)",
            lineHeight: 1.6,
            color: "#666",
            marginTop: "14px",
            padding: "0 4px"
          }}
        >
          {captionPreview}
        </p>
      )}
    </motion.div>
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function MasonryLayout({ items, renderItem }: { items: VideoItem[], renderItem: (item: VideoItem, index: number) => React.ReactNode }) {
  const width = useWindowWidth();
  let columns = 3;
  if (width < 640) columns = 1;
  else if (width < 1024) columns = 2;

  const columnWrappers: VideoItem[][] = Array.from({ length: columns }, () => []);

  items.forEach((item, i) => {
    columnWrappers[i % columns].push(item);
  });

  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%', alignItems: 'flex-start' }}>
      {columnWrappers.map((col, colIndex) => (
        <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minWidth: 0 }}>
          <AnimatePresence>
            {col.map(item => renderItem(item, items.indexOf(item)))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ---- Main Gallery (used on homepage) ---- */
export function VideoGallery() {
  const [, setTick] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [language] = useLanguage();

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", h);
    return () => window.removeEventListener("siteConfigChanged", h);
  }, []);

  const allVideos = getVideos();
  if (allVideos.length === 0) return null;

  const featured = allVideos.filter((v) => v.featured);
  const displayVideos = showAll ? allVideos : (featured.length > 0 ? featured : allVideos.slice(0, 4));
  const hasMore = allVideos.length > displayVideos.length;

  return (
    <div
      className="border-t"
      style={{
        borderColor: "rgba(0,0,0,0.08)",
        padding: "clamp(48px, 8vw, 80px) 0",
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ ...mono, marginBottom: "16px" }}
      >
        {language === "id" ? "Video & Konten" : "Video & Content"}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          ...serif,
          fontSize: "clamp(24px, 4vw, 48px)",
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: "#1a1a1a",
          marginBottom: "clamp(32px, 5vw, 48px)",
          maxWidth: "500px",
        }}
      >
        {language === "id" ? (
          <>
            Lihat kami <em style={{ fontWeight: 300 }}>beraksi</em>
          </>
        ) : (
          <>
            See us <em style={{ fontWeight: 300 }}>in action</em>
          </>
        )}
      </motion.h2>

      {/* True Pinterest Masonry Layout */}
      <MasonryLayout
        items={displayVideos}
        renderItem={(v, i) => <VideoCard key={v.id} video={v} index={i} />}
      />

      {/* Show all / collapse button */}
      {(hasMore || showAll) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", marginTop: "clamp(32px, 5vw, 64px)" }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              ...mono,
              fontSize: "10px",
              padding: "14px 32px",
              border: "1px solid rgba(0,0,0,0.15)",
              backgroundColor: "transparent",
              color: "#555",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1a1a1a";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            {showAll
              ? (language === "id" ? "← Tampilkan Unggulan Saja" : "← Show Featured Only")
              : (language === "id" ? `Lihat Semua Video (${allVideos.length}) →` : `View All Videos (${allVideos.length}) →`)}
          </button>
        </motion.div>
      )}

    </div>
  );
}

/* ---- Studio Video Section (for Tentang Kami page) ---- */
export function StudioVideoSection() {
  const [, setTick] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const [language] = useLanguage();

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", h);
    return () => window.removeEventListener("siteConfigChanged", h);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedVideo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedVideo]);

  const allVideos = getVideos();
  if (allVideos.length === 0) return null;
  const displayVideos = [...allVideos].sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <div
      className="border-t"
      style={{
        borderColor: "rgba(0,0,0,0.08)",
        paddingTop: "clamp(48px, 6vw, 80px)",
        paddingBottom: "clamp(48px, 6vw, 80px)",
      }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ ...mono, marginBottom: "16px" }}
      >
        {language === "id" ? "Galeri Video" : "Video Gallery"}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          ...serif,
          fontSize: "clamp(24px, 3vw, 40px)",
          fontWeight: 300,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "#1a1a1a",
          marginBottom: "clamp(24px, 4vw, 40px)",
          maxWidth: "500px",
        }}
      >
        {language === "id" ? (
          <>
            Cerita di balik <em style={{ fontWeight: 300 }}>karya kami</em>
          </>
        ) : (
          <>
            Stories behind <em style={{ fontWeight: 300 }}>our work</em>
          </>
        )}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          lineHeight: 1.8,
          color: "#666",
          maxWidth: "680px",
          marginBottom: "28px",
        }}
      >
        {language === "id"
          ? "Preview video dibuat seperti kartu editorial yang responsif: tetap menampilkan cuplikan, mengikuti ukuran layar, dan bisa dibuka penuh saat diklik."
          : "The video previews are designed like responsive editorial cards: they still show a preview, adapt to screen size, and can be opened full size when clicked."}
      </motion.p>

      {/* Pinterest-style responsive masonry preview */}
      <div style={{ marginTop: "28px" }}>
        <MasonryLayout
          items={displayVideos}
          renderItem={(v, i) => <VideoCard key={v.id} video={v} index={i} onSelect={setSelectedVideo} />}
        />
      </div>

      {/* Modal for selected video */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "center",
              zIndex: 9999,
              backdropFilter: "blur(2px)",
              padding: isMobile ? "10px" : "20px",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: isMobile ? "100%" : "90vw",
                height: isMobile ? "70dvh" : "90vh",
                maxWidth: "1000px",
                maxHeight: isMobile ? "85dvh" : "700px",
                borderRadius: isMobile ? "10px" : "12px",
                overflow: "hidden",
                background: "#0a0a0a",
              }}
            >
              {(() => {
                let iframeSrc = "";
                if (selectedVideo.source === "youtube") iframeSrc = getYouTubeEmbedUrl(selectedVideo.url);
                else if (selectedVideo.source === "tiktok") iframeSrc = getTikTokEmbedUrl(selectedVideo.url);
                else if (selectedVideo.source === "instagram") iframeSrc = getInstagramEmbedUrl(selectedVideo.url);
                else iframeSrc = selectedVideo.url;

                return iframeSrc ? (
                  selectedVideo.source === "file" ? (
                    <video
                      src={iframeSrc}
                      controls
                      autoPlay
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : (
                    <iframe
                      src={iframeSrc}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                        display: "block",
                      }}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.caption}
                    />
                  )
                ) : null;
              })()}

              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                style={{
                  position: "absolute",
                  top: isMobile ? "10px" : "16px",
                  right: isMobile ? "10px" : "16px",
                  width: isMobile ? "36px" : "40px",
                  height: isMobile ? "36px" : "40px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "18px" : "20px",
                  transition: "all 0.3s ease",
                  zIndex: 10000,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
