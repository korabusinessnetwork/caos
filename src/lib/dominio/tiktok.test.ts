import { describe, it, expect } from 'vitest';
import { ehUrlTikTokValida } from './tiktok';

describe('ehUrlTikTokValida', () => {
  it('aceita URLs legítimas de TikTok em https', () => {
    expect(ehUrlTikTokValida('https://www.tiktok.com/@user/video/123')).toBe(true);
    expect(ehUrlTikTokValida('https://tiktok.com/@user/video/123')).toBe(true);
    expect(ehUrlTikTokValida('https://vm.tiktok.com/ZM123/')).toBe(true);
    expect(ehUrlTikTokValida('  https://vt.tiktok.com/abc  ')).toBe(true);
  });

  it('rejeita protocolo não-https', () => {
    expect(ehUrlTikTokValida('http://tiktok.com/@user/video/1')).toBe(false);
  });

  it('rejeita hosts que imitam o TikTok', () => {
    expect(ehUrlTikTokValida('https://eviltiktok.com/x')).toBe(false);
    expect(ehUrlTikTokValida('https://tiktok.com.evil.com/x')).toBe(false);
  });

  it('rejeita vazio, nulo e strings inválidas', () => {
    expect(ehUrlTikTokValida('')).toBe(false);
    expect(ehUrlTikTokValida(null)).toBe(false);
    expect(ehUrlTikTokValida(undefined)).toBe(false);
    expect(ehUrlTikTokValida('não é url')).toBe(false);
    expect(ehUrlTikTokValida('javascript:alert(1)')).toBe(false);
  });
});
