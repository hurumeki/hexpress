import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig({
    plugins: [
        react(),
        checker({ typescript: true }),
    ],
    define: {
        // ビルド時デフォルト言語: 環境変数 DEFAULT_LANG で切替可能
        // 例: DEFAULT_LANG=en npx vite build
        __DEFAULT_LANG__: JSON.stringify(process.env.DEFAULT_LANG ?? 'ja'),
    },
})
