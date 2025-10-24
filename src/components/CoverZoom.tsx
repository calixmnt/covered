import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    FaTimes, 
    FaExpand, 
    FaCompress, 
    FaDownload, 
    FaHeart,
    FaShare,
    FaPlay,
    FaRedo,
    FaSearchPlus,
    FaSearchMinus
} from 'react-icons/fa';

interface CoverZoomProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    title: string;
    artist: string;
    albumType?: string;
    releaseDate?: string;
    onFavorite?: () => void;
    onShare?: () => void;
    isFavorite?: boolean;
}

export function CoverZoom({
    isOpen,
    onClose,
    imageUrl,
    title,
    artist,
    albumType,
    releaseDate,
    onFavorite,
    onShare,
    isFavorite = false
}: CoverZoomProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showControls, setShowControls] = useState(true);
    
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset states when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setRotation(0);
            setPosition({ x: 0, y: 0 });
            setImageLoaded(false);
            setShowControls(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsFullscreen(false);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Keyboard controls
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case '+':
                case '=':
                    handleZoomIn();
                    break;
                case '-':
                    handleZoomOut();
                    break;
                case 'r':
                case 'R':
                    handleRotate();
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
                case ' ':
                    e.preventDefault();
                    resetView();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Auto-hide controls
    useEffect(() => {
        if (!isOpen) return;

        let timeout: NodeJS.Timeout;
        
        const resetTimeout = () => {
            clearTimeout(timeout);
            setShowControls(true);
            timeout = setTimeout(() => setShowControls(false), 3000);
        };

        const handleMouseMove = () => resetTimeout();
        
        resetTimeout();
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isOpen]);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev * 1.5, 5));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev / 1.5, 0.5));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const resetView = () => {
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${artist} - ${title}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 5));
    };

    if (!isOpen) return null;

    const modal = (
        <div 
            ref={containerRef}
            className={`cover-zoom-modal ${isFullscreen ? 'fullscreen' : ''}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Background with blur effect */}
            <div 
                className="cover-zoom-background"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                }}
            />

            {/* Controls overlay */}
            <div className={`cover-zoom-controls ${showControls ? 'visible' : 'hidden'}`}>
                {/* Top controls */}
                <div className="cover-zoom-controls-top">
                    <div className="cover-zoom-info">
                        <h2 className="cover-zoom-title">{title}</h2>
                        <p className="cover-zoom-artist">{artist}</p>
                        {albumType && <span className="cover-zoom-type">{albumType}</span>}
                        {releaseDate && <span className="cover-zoom-date">{new Date(releaseDate).getFullYear()}</span>}
                    </div>
                    
                    <div className="cover-zoom-actions">
                        {onFavorite && (
                            <button 
                                onClick={onFavorite}
                                className={`cover-zoom-btn ${isFavorite ? 'active' : ''}`}
                                title="Toggle favorite"
                            >
                                <FaHeart />
                            </button>
                        )}
                        
                        {onShare && (
                            <button 
                                onClick={onShare}
                                className="cover-zoom-btn"
                                title="Share"
                            >
                                <FaShare />
                            </button>
                        )}
                        
                        <button 
                            onClick={handleDownload}
                            className="cover-zoom-btn"
                            title="Download image"
                        >
                            <FaDownload />
                        </button>
                        
                        <button 
                            onClick={toggleFullscreen}
                            className="cover-zoom-btn"
                            title="Toggle fullscreen (F)"
                        >
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="cover-zoom-btn close-btn"
                            title="Close (Esc)"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Bottom controls */}
                <div className="cover-zoom-controls-bottom">
                    <div className="cover-zoom-tools">
                        <button 
                            onClick={handleZoomOut}
                            className="cover-zoom-btn"
                            title="Zoom out (-)"
                        >
                            <FaSearchMinus />
                        </button>
                        
                        <span className="cover-zoom-level">
                            {Math.round(zoom * 100)}%
                        </span>
                        
                        <button 
                            onClick={handleZoomIn}
                            className="cover-zoom-btn"
                            title="Zoom in (+)"
                        >
                            <FaSearchPlus />
                        </button>
                        
                        <button 
                            onClick={handleRotate}
                            className="cover-zoom-btn"
                            title="Rotate (R)"
                        >
                            <FaRedo />
                        </button>
                        
                        <button 
                            onClick={resetView}
                            className="cover-zoom-btn"
                            title="Reset view (Space)"
                        >
                            Reset
                        </button>
                    </div>
                    
                    <div className="cover-zoom-shortcuts">
                        <span>ESC: Close | +/-: Zoom | R: Rotate | F: Fullscreen | Space: Reset</span>
                    </div>
                </div>
            </div>

            {/* Main image container */}
            <div 
                className="cover-zoom-image-container"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{
                    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={`${title} by ${artist}`}
                    className={`cover-zoom-image ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                    style={{
                        transform: `
                            translate(${position.x}px, ${position.y}px) 
                            scale(${zoom}) 
                            rotate(${rotation}deg)
                        `,
                        transition: isDragging ? 'none' : 'transform 0.3s ease'
                    }}
                    draggable={false}
                />
                
                {!imageLoaded && (
                    <div className="cover-zoom-loading">
                        <div className="cover-zoom-spinner"></div>
                        <p>Loading high resolution image...</p>
                    </div>
                )}
            </div>

            {/* Play button overlay */}
            <button className="cover-zoom-play-btn">
                <FaPlay />
            </button>
        </div>
    );

    return createPortal(modal, document.body);
}
