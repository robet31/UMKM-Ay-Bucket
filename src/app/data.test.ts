import { describe, expect, it } from 'vitest';
import {
  categories,
  defaultProducts,
  detectVideoSource,
  getInstagramEmbedUrl,
  getTikTokEmbedUrl,
  getYouTubeEmbedUrl,
  normalizeProductRecord,
  normalizeStoredProducts,
} from './data';

describe('catalog data', () => {
  it('keeps base categories available', () => {
    expect(categories.length).toBeGreaterThanOrEqual(7);
  });

  it('keeps default products available', () => {
    expect(defaultProducts.length).toBeGreaterThan(0);
  });

  it('normalizes legacy products into images arrays', () => {
    const result = normalizeProductRecord({
      id: 'legacy-1',
      name: 'Legacy Product',
      category: 'catalog-home',
      price: 1000,
      priceLabel: 'Rp 1.000',
      image: '/assets/legacy.jpg',
    });

    expect(result.image).toBe('/assets/legacy.jpg');
    expect(result.images).toEqual(['/assets/legacy.jpg']);
  });

  it('preserves explicit images arrays and fills the primary image', () => {
    const result = normalizeProductRecord({
      id: 'legacy-2',
      name: 'Multi Image Product',
      category: 'catalog-home',
      price: 1000,
      priceLabel: 'Rp 1.000',
      images: ['/assets/a.jpg', '/assets/b.jpg'],
    });

    expect(result.image).toBe('/assets/a.jpg');
    expect(result.images).toEqual(['/assets/a.jpg', '/assets/b.jpg']);
  });

  it('normalizes a stored product list', () => {
    const result = normalizeStoredProducts([
      {
        id: 'legacy-3',
        name: 'Stored Product',
        category: 'catalog-home',
        price: 1000,
        priceLabel: 'Rp 1.000',
        image: '/assets/stored.jpg',
      },
    ]);

    expect(result[0].images).toEqual(['/assets/stored.jpg']);
  });
});

describe('video helpers', () => {
  it('detects common video sources', () => {
    expect(detectVideoSource('https://www.youtube.com/watch?v=abc')).toBe('youtube');
    expect(detectVideoSource('https://www.instagram.com/reel/abc/')).toBe('instagram');
    expect(detectVideoSource('https://www.tiktok.com/@user/video/123')).toBe('tiktok');
    expect(detectVideoSource('https://example.com/video.mp4')).toBe('file');
  });

  it('creates youtube embed urls with autoplay', () => {
    expect(getYouTubeEmbedUrl('https://youtu.be/AKEXXIh-244')).toContain('https://www.youtube.com/embed/AKEXXIh-244');
    expect(getYouTubeEmbedUrl('https://youtu.be/AKEXXIh-244')).toContain('autoplay=1');
  });

  it('creates instagram embed urls', () => {
    expect(getInstagramEmbedUrl('https://www.instagram.com/reel/ABC123/')).toBe('https://www.instagram.com/p/ABC123/embed/?hidecaption=true');
  });

  it('creates tiktok embed urls', () => {
    expect(getTikTokEmbedUrl('https://www.tiktok.com/@aybucket/video/1234567890')).toBe('https://www.tiktok.com/embed/v2/1234567890');
  });
});
