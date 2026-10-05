import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/6311ass2/',plugins:[react()],build:{outDir:'dist/client'},server:{host:'0.0.0.0',port:5173,strictPort:true},test:{include:['src/**/*.test.ts']}});
