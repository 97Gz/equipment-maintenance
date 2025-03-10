/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/NavBar.vue' {
  import { DefineComponent } from 'vue'
  const NavBar: DefineComponent<{}, {}, any>
  export default NavBar
}

declare module '@/components/TabBar.vue' {
  import { DefineComponent } from 'vue'
  const TabBar: DefineComponent<{}, {}, any>
  export default TabBar
}

declare module '@/components/EquipmentCard.vue' {
  import { DefineComponent } from 'vue'
  const EquipmentCard: DefineComponent<{}, {}, any>
  export default EquipmentCard
} 