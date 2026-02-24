import { useState } from 'react';

function ExpandableImage({url,alt,imgStyle}:{url:string, alt:string, imgStyle?: React.CSSProperties }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {/* Thumbnail */}
            <img
                src={url}
                alt={alt}
                style={{ cursor: 'zoom-in',...imgStyle ??{} }}
                onClick={() => setIsOpen(true)}
            />

            {/* Overlay that appears when clicked */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'zoom-out',
                        zIndex: 9999
                    }}
                >
                    <img
                        src={url}
                        alt={alt}
                        style={{ maxWidth: '90%', maxHeight: '90%' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ExpandableImage;