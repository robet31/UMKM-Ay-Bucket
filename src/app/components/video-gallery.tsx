import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getVideos,
  getYouTubeEmbedUrl,
  getTikTokEmbedUrl,
  getInstagramEmbedUrl,
  type VideoItem,
} from "../data";

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

/* ---- Single Video Card (masonry-friendly) ---- */
function VideoCard({ video, index }: { video: VideoItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !iframeSrc) {
      if (video.source === "youtube") setIframeSrc(getYouTubeEmbedUrl(video.url));
      else if (video.source === "tiktok") setIframeSrc(getTikTokEmbedUrl(video.url));
      else if (video.source === "instagram") setIframeSrc(getInstagramEmbedUrl(video.url));
      else setIframeSrc(video.url);
    }
  }, [isVisible, video, iframeSrc]);

  const isVertical = video.orientation === "vertical";
  const isSquare = video.orientation === "square";
  const aspectRatio = isVertical ? "9/16" : isSquare ? "1/1" : "16/9";

  const sourceLabel =
    video.source === "youtube" ? "YT" :
    video.source === "instagram" ? "IG" :
    video.source === "tiktok" ? "TT" : "📹";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className={`bento-item ori-${video.orientation}`}
      style={{
        display: "flex",
        flexDirection: "column",
        breakInside: "avoid",
        marginBottom: "24px",
      }}
    >
      {/* Video embed */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: aspectRatio,
          overflow: "hidden",
          backgroundColor: "#0a0a0a",
          borderRadius: "12px",
        }}
      >
        {iframeSrc ? (
          video.source === "file" ? (
            <video
              src={iframeSrc}
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              ref={(el) => {
                if (el) {
                  if (isVisible) el.play().catch(() => {});
                  else el.pause();
                }
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
              loading="lazy"
              title={video.caption}
            />
          )
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </div>
        )}

        {/* Source badge overlay */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            ...mono,
            fontSize: "7px",
            padding: "3px 8px",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            backdropFilter: "blur(4px)",
            borderRadius: "4px",
          }}
        >
          {sourceLabel}
        </div>
      </div>

      {/* Caption */}
      {video.caption && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(12px, 1.4vw, 14px)",
            lineHeight: 1.6,
            color: "#666",
            marginTop: "12px",
            padding: "0 4px"
          }}
        >
          {video.caption}
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
        Video & Konten
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
        Lihat kami <em style={{ fontWeight: 300 }}>beraksi</em>
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
              ? "← Tampilkan Unggulan Saja"
              : `Lihat Semua Video (${allVideos.length}) →`}
          </button>
        </motion.div>
      )}

    </div>
  );
}

/* ---- Studio Video Section (for Tentang Kami page) ---- */
export function StudioVideoSection() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("siteConfigChanged", h);
    return () => window.removeEventListener("siteConfigChanged", h);
  }, []);

  const allVideos = getVideos();
  if (allVideos.length === 0) return null;

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
        Galeri Video
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
        Cerita di balik <em style={{ fontWeight: 300 }}>karya kami</em>
      </motion.h2>

      {/* True Pinterest Masonry Layout */}
      <div style={{ marginTop: "24px" }}>
        <MasonryLayout 
          items={allVideos} 
          renderItem={(v, i) => <VideoCard key={v.id} video={v} index={i} />} 
        />
      </div>
    </div>
  );
}
