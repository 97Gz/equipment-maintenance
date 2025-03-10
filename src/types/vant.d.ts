declare module 'vant' {
  import { App } from 'vue';
  
  const Vant: {
    install: (app: App) => void;
  };
  
  export default Vant;
  
  export const showToast: (options: any) => void;
  export const showDialog: (options: any) => void;
  export const showNotify: (options: any) => void;
} 