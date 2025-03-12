import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { serverConfig } from './src/config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  
  // 获取服务器配置
  // 直接从serverConfig中读取development环境配置，避免依赖getServerConfig方法
  const devServerConfig = serverConfig.development
  
  return {
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: devServerConfig.host,
      port: devServerConfig.port,
      strictPort: true, // 确保使用指定的端口，如果被占用则启动失败
      open: true,
      // 为了避免代理问题，禁用HTTP代理，所有API请求由前端的Mock服务处理
      proxy: {} // 删除代理配置，避免请求被转发到外部服务器
    },
  }
})
