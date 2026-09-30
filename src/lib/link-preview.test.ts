import { describe, expect, it } from 'vitest';
import {
  previewImageCandidates,
  safePreviewImage,
  youtubeThumbnailFromUrl,
} from './link-preview';
import { getPlatformByUrl } from './social-platforms';

describe('link preview images', () => {
  it('uses a saved image first and a YouTube thumbnail as fallback', () => {
    expect(previewImageCandidates(
      'https://youtu.be/H1e5BhMmmi0?si=share',
      'https://cdn.example.com/preview.webp',
    )).toEqual([
      'https://cdn.example.com/preview.webp',
      'https://i.ytimg.com/vi/H1e5BhMmmi0/hqdefault.jpg',
    ]);
  });

  it('derives a thumbnail from standard YouTube video forms', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=H1e5BhMmmi0',
      'https://youtube.com/shorts/H1e5BhMmmi0',
      'https://m.youtube.com/live/H1e5BhMmmi0',
    ]) {
      expect(youtubeThumbnailFromUrl(url)).toBe(
        'https://i.ytimg.com/vi/H1e5BhMmmi0/hqdefault.jpg',
      );
    }
    expect(getPlatformByUrl('https://youtu.be/H1e5BhMmmi0')?.name).toBe('YouTube');
  });

  it('rejects unsafe or unrelated image and video URLs', () => {
    expect(safePreviewImage('javascript:alert(1)')).toBeUndefined();
    expect(safePreviewImage('https://user:pass@cdn.example.com/a.jpg')).toBeUndefined();
    expect(youtubeThumbnailFromUrl('https://youtube.com.evil.test/watch?v=H1e5BhMmmi0')).toBeUndefined();
    expect(youtubeThumbnailFromUrl('https://www.youtube.com/watch?v=bad')).toBeUndefined();
    expect(previewImageCandidates('https://instagram.com/reel/123', null)).toEqual([]);
  });
});
