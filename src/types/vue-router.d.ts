declare module 'vue-router' {
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
  
  export declare type RouteRecordRaw = {
    path: string;
    name?: string;
    component?: any;
    components?: Record<string, any>;
    redirect?: string | Location | Function;
    meta?: Record<string | number | symbol, any>;
    children?: RouteRecordRaw[];
  };
  
  export { createRouter, createWebHistory, useRouter, useRoute } from 'vue-router';
} 