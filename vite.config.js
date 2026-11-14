import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // <--- यह सबसे जरूरी लाइन है जो सारे पाथ की बीमारी जड़ से खत्म कर देगी!
})
