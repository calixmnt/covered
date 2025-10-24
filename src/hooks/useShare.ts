import { useCallback } from 'react';

interface ShareData {
    id: string;
    title: string;
    artist: string;
    type?: 'album' | 'track' | 'artist';
    image?: string;
}

interface UseShareReturn {
    shareItem: (data: ShareData) => Promise<boolean>;
    copyToClipboard: (text: string) => Promise<boolean>;
    canShare: boolean;
}

export function useShare(): UseShareReturn {
    const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

    const generateShareUrl = useCallback((data: ShareData) => {
        const baseUrl = window.location.origin;
        const path = data.type === 'artist' ? `/artists/${data.id}` : `/covers/${data.id}`;
        return `${baseUrl}${path}`;
    }, []);

    const generateShareText = useCallback((data: ShareData) => {
        const url = generateShareUrl(data);
        switch (data.type) {
            case 'artist':
                return `Check out ${data.artist} on Covered! ${url}`;
            case 'track':
                return `Listen to "${data.title}" by ${data.artist} on Covered! ${url}`;
            default:
                return `Check out "${data.title}" by ${data.artist} on Covered! ${url}`;
        }
    }, [generateShareUrl]);

    const shareItem = useCallback(async (data: ShareData): Promise<boolean> => {
        const shareText = generateShareText(data);
        const shareUrl = generateShareUrl(data);

        // Try native sharing first (mobile devices)
        if (canShare) {
            try {
                await navigator.share({
                    title: `${data.title} - ${data.artist}`,
                    text: shareText,
                    url: shareUrl,
                });
                return true;
            } catch (error) {
                // User cancelled or error occurred, fall back to clipboard
                console.log('Native sharing cancelled or failed:', error);
            }
        }

        // Fallback to clipboard
        return copyToClipboard(shareText);
    }, [canShare, generateShareText, generateShareUrl]);

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                return success;
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }, []);

    return {
        shareItem,
        copyToClipboard,
        canShare
    };
}
