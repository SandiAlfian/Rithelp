import fs from 'fs';
import path from 'path';
import { Video } from '@/types/insight';

const CACHE_DIR = path.join(process.cwd(), '.cache');

export const youtubeCache = {
  getCacheKey(mode: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `yt_${mode}_${today}.json`;
  },

  async get(mode: string): Promise<Video[] | null> {
    try {
      const fileName = this.getCacheKey(mode);
      const filePath = path.join(CACHE_DIR, fileName);
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Cache Read Error:", error);
    }
    return null;
  },

  async set(mode: string, data: Video[]): Promise<void> {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }

      // Cleanup old cache files
      const files = fs.readdirSync(CACHE_DIR);
      const today = new Date().toISOString().split('T')[0];
      files.forEach(file => {
        if (!file.includes(today)) {
          fs.unlinkSync(path.join(CACHE_DIR, file));
        }
      });

      const fileName = this.getCacheKey(mode);
      const filePath = path.join(CACHE_DIR, fileName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Cache Write Error:", error);
    }
  }
};
