import { useEffect } from 'react';

type InstagramEmbedProps = {
    link: string
}

const EmbedContent = ({ link }: InstagramEmbedProps) => {

    useEffect(() => {
        const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "//www.instagram.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        } else {
            (window as any).instgrm?.Embeds?.process();
        }
    }, [link]);

    return (
        <div className="custom-select">
            {link && (
                <blockquote
                    className="instagram-media w-full"
                    data-instgrm-captioned
                    style={{ width: 400, minWidth: 400, maxWidth: 400 }}
                    data-instgrm-permalink={`${link}?utm_source=ig_embed&amp;utm_campaign=loading`}
                    data-instgrm-version="14"
                ></blockquote>
            )}
        </div>
    );
};


export default EmbedContent