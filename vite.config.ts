import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { comlink } from 'vite-plugin-comlink'
import { VitePWA } from 'vite-plugin-pwa'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDevelopment = mode === 'development';

    const serverConfig = isDevelopment ? {
        open: true,
        proxy: {
            '/api': {
                target: `http://${env.VITE_API_ENDPOINT}`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
            '/sdr': {
                target: `http://${env.VITE_API_ENDPOINT}`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/sdr/, '/sdr'),
            },
        }
    } : {};

    return {
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [comlink(), react(), VitePWA({
        registerType: 'autoUpdate',
        //Cache All Imports
        workbox: {
            globPatterns: ["**/*", "**/*.png"],
        },
        //Cache Static Assets
        includeAssets: [
            "**/*",
            "**/*.png",
            "**/*.gif"
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
    assetsInclude: ["**/*.png", "**/*.gif"],
    server: serverConfig,
    build: {
        assetsDir: "static",
    }
}})