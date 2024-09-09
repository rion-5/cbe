import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	server: {
		// host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능하게 설정
		// port: 3000, // Vite 개발 서버 포트
		hmr: {
		//   host: '166.104.191.59', // WebSocket 연결을 위한 호스트
		  port: 3000
		}
	  },
	plugins: [sveltekit()]
});
