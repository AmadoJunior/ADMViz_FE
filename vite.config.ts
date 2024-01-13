import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { comlink } from 'vite-plugin-comlink'
import { VitePWA } from 'vite-plugin-pwa'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [comlink(), react(), VitePWA({
        registerType: 'autoUpdate',
        //Cache All Imports
        workbox: {
            globPatterns: ["**/*", "**/*.PNG", "**/*.png"],
        },
        //Cache Static Assets
        includeAssets: [
            "**/*",
            "**/*.PNG"
        ],
        manifest: {
            name: 'ADMViz',
            short_name: 'ADMViz',
            description: 'Customizable Visualizations',
            theme_color: "#f69435",
            background_color: "#f69435",
            display: "standalone",
            scope: "/",
            start_url: "/",
            icons: [
              {
                src: 'logo192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'logo512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
    }), viteTsconfigPaths()],
    worker: {
        plugins: () => [comlink()],
    },
    assetsInclude: ["**/*.PNG"],
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000, 
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/sdr': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
        }
    },
    build: {
        assetsDir: "static",
    }
})