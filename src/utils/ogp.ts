import * as cheerio from 'cheerio';
import { parse as parseUrl } from 'node:url';
import { useConfig } from '@/config/site'; 

export interface OgpData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  favicon: string;
}

/**
 * URLからOGP情報を取得する
 */
export async function getOgpData(url: string): Promise<OgpData | null> {
  const config = useConfig();
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": config.isLocal
          ? "Mozilla/5.0 (compatible; AstroBot/1.0; +https://astro.build)"
          : `Mozilla/5.0 (compatible; ${config.title}/1.0; +${config.baseUrl})`,
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const parsedUrl = parseUrl(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    
    // OGP情報を抽出
    const ogpData: OgpData = {
      url,
      title: $('meta[property="og:title"]').attr('content') || 
             $('title').text() || 
             url,
      description: $('meta[property="og:description"]').attr('content') || 
                  $('meta[name="description"]').attr('content') || 
                  '',
      image: $('meta[property="og:image"]').attr('content') || 
             '',
      siteName: $('meta[property="og:site_name"]').attr('content') || 
                parsedUrl.hostname || 
                '',
      favicon: $('link[rel="icon"]').attr('href') || 
               $('link[rel="shortcut icon"]').attr('href') || 
               '/favicon.ico',
    };
    
    // 相対URLを絶対URLに変換
    if (ogpData.image && !ogpData.image.startsWith('http')) {
      ogpData.image = new URL(ogpData.image, baseUrl).toString();
    }
    
    if (ogpData.favicon && !ogpData.favicon.startsWith('http')) {
      ogpData.favicon = new URL(ogpData.favicon, baseUrl).toString();
    }
    
    return ogpData;
  } catch (error) {
    console.error(`Error fetching OGP data from ${url}:`, error);
    return null;
  }
}
