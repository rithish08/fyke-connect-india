import React from 'react';
import { Helmet } from 'react-helmet-async';

const PWAManifest: React.FC = () => {
  const manifestData = {
    name: "Fyke - Connect with Local Workers & Jobs",
    short_name: "Fyke",
    description: "Find local workers for your projects or discover job opportunities in your area",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3B82F6",
    orientation: "portrait-primary",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa-512x512.png", 
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa-maskable-192x192.png",
        sizes: "192x192", 
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png", 
        purpose: "maskable"
      }
    ]
  };

  return (
    <Helmet>
      <link 
        rel="manifest" 
        href={`data:application/json,${encodeURIComponent(JSON.stringify(manifestData))}`} 
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Fyke" />
      <meta name="apple-mobile-web-app-title" content="Fyke" />
      <meta name="msapplication-starturl" content="/" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Microsoft Tiles */}
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
    </Helmet>
  );
};

export default PWAManifest;