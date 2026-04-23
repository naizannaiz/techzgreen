import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom'],
          'vendor-router':   ['react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ui':       ['lucide-react', 'react-qr-code'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/supabase-api': {
        target: 'https://zzjsxautlfokavkcpjfa.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-api/, ''),
        secure: true,
      },
    },
  },
})
