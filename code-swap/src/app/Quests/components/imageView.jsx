'use client';
import { useEffect } from 'react';
import pannellum from 'pannellum';

import room from '../Images/room1.jpg';
import { useParams, useRouter } from 'next/navigation';

const ImageView = () => {
  const router = useRouter();
  const { questId } = useParams();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pannellum = require('pannellum');
      const viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: room,
        autoLoad: true,
        author: 'Author Name',
        title: 'Title',
        orientationOnByDefault: false,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        showControls: false,
        preview: room,
        previewTitle: 'Preview',
      });

      viewer.addHotSpot({
        type: 'info',
        pitch: 11,
        yaw: -167,
        text: 'Info Hotspot',
      });
    }
  }, []);

  return (
    <div style={{ width: '100%', marginTop: '120px', display: 'flex', justifyContent: 'center' }}>
      <div id="panorama" style={{ width: '800px', height: '600px', border: '1px solid white' }}></div>
    </div>
  );
};

export default ImageView;