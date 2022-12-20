import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export const isHttps : boolean = true;
export default defineConfig({
  server: {
    https: isHttps
  },
  plugins: [react(),mkcert()],
  
})
