import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

export function SEO({ 
    title = 'Covered - Discover & Explore Album Artwork',
    description = 'Explore, zoom, and discover album covers like never before. Your personal gallery of music art with daily discoveries and high-quality artwork from Spotify.',
    image = 'https://covered.lavibeagency.com/og-image.jpg',
    type = 'website'
}: SEOProps) {
    const location = useLocation();
    const url = `https://covered.lavibeagency.com${location.pathname}`;

    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta tags
        updateMetaTag('name', 'description', description);
        updateMetaTag('name', 'title', title);
        
        // Update OG tags
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', description);
        updateMetaTag('property', 'og:image', image);
        updateMetaTag('property', 'og:url', url);
        updateMetaTag('property', 'og:type', type);
        
        // Update Twitter tags
        updateMetaTag('property', 'twitter:title', title);
        updateMetaTag('property', 'twitter:description', description);
        updateMetaTag('property', 'twitter:image', image);
        updateMetaTag('property', 'twitter:url', url);

        // Update canonical link
        updateCanonical(url);
    }, [title, description, image, url, type]);

    return null;
}

function updateMetaTag(attribute: string, key: string, content: string) {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
}

function updateCanonical(url: string) {
    let link = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
}
