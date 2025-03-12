declare module '@/store/equipment' {
  export interface Equipment {
    id: string;
    code: string;
    name: string;
    type: string;
    model: string;
    status: string;
    workshop: string;
    location: string;
    manager: string;
    managerContact: string;
    manufacturer: string;
    purchaseDate: string;
    enableDate: string;
    supplier: {
      id: string;
      name: string;
      code: string;
    };
    checkInfo: {
      standardName: string;
      standardCode: string;
      lastCheckTime: string;
    };
    patrolInfo: {
      planName: string;
      planCode: string;
      scheduledDate: string;
      lastPatrolTime: string;
      dailyCount: number;
    };
    repairInfo: {
      lastRepairTime: string;
    };
    maintenanceInfo: {
      lastMaintenanceTime: string;
    };
    scrapInfo: {
      scrapTime: string;
    };
    createTime: string;
    updateTime: string;
  }

  export function useEquipmentStore(): {
    equipmentList: Equipment[];
    currentEquipment: Equipment | null;
    
    // getters
    getEquipmentList: Equipment[];
    getCurrentEquipment: Equipment | null;
    
    // actions
    fetchEquipmentList(): Promise<void>;
    fetchEquipmentDetail(id: string): Promise<Equipment>;
    saveEquipment(equipment: Partial<Equipment>): Promise<any>;
    deleteEquipment(id: string): Promise<boolean>;
  };
} 