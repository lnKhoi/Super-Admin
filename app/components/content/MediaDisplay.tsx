import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8787',
    timeout: 20000,
    headers: { contentType: "application/json", "ngrok-skip-browser-warning": "true", },
    responseType: "blob",
});


const getAuthHeaders = () => {
    const token = localStorage.getItem("remix_us_tk");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getData = async (url: string, params = {}) => {
    try {
        const result = await axiosClient.get(url, { params, headers: getAuthHeaders() });
        return result;
    } catch (e) {
        throw e;
    }
};


export const getMedia = (filename:string) => {
    return getData(`api/v1/content/media/${filename}`)
}


const MediaDisplay = ({ campaignId, filename }) => {
    const [mediaUrl, setMediaUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {

                const response = await getMedia( filename)
                if (!response.ok) {
                    throw new Error('Failed to fetch media');
                }
                const blob = await response.blob(); // Get the file as a Blob
                const url = URL.createObjectURL(blob); // Create a URL for the Blob
                setMediaUrl(url); // Set the media URL for display
            } catch (err) {
                setError(err.message);
            }
        };
        fetchMedia();
    }, []);

    if (error) {
        return <div>Error: {error}</div>; // Display any errors
    }
    if (!mediaUrl) {
        return <div>Loading...</div>; // Display a loading message while fetching
    }
    const extension = filename.split('.').pop()?.toLowerCase();


   
    return (
        <div>
            {['jpg', 'jpeg', 'png'].includes(extension) && (
                <img src={mediaUrl} alt={filename} style={{ maxWidth: '100%' }} />
            )}
            {['mp4', 'mov'].includes(extension) && (
                <video controls style={{ maxWidth: '100%' }}>
                    <source src={mediaUrl} type={`video/${extension}`} />
                    Your browser does not support the video tag.
                </video>
            )}
            {extension === 'csv' && (
                <a href={mediaUrl} download={filename}>Download CSV</a>
            )}
        </div>
    );
};

export default MediaDisplay;