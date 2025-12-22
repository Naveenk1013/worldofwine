import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [
        react(),
        // glsl() // For loading shader files - will enable when needed
    ],
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
    resolve: {
        alias: {
            'three': 'three',
            'react': 'react',
            'react-dom': 'react-dom'
        },
        dedupe: ['three', 'react', 'react-dom']
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'three-vendor': ['three'],
                    'react-three': ['@react-three/fiber', '@react-three/drei'],
                    'animations': ['gsap', 'framer-motion'],
                    'data-viz': ['d3', 'd3-force-3d']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
        include: ['three', '@react-three/fiber', '@react-three/drei']
    }
});
