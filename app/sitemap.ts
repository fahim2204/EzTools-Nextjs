
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ezcalc.xyz';
  
  // Define your static routes here
  const routes = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/age-calculator',
    '/bmi-calculator',
    '/gold-price-calculator',
    '/land-calculator',
    '/loan-calculator',
    '/mortgage-calculator',
    '/percentage-calculator',
    '/tip-calculator',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2025-12-18'),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
