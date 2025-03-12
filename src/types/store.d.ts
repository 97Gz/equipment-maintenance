declare module '@/store/check' {
  import { CheckStandard, CheckRecord } from '@/utils/mock/check';

  export interface CheckItem {
    id?: string;
    name: string;
    method: string;
    minValue?: string;
    maxValue?: string;
    unit?: string;
  }

  export interface CheckRecordItem {
    name: string;
    method: string;
    standardRange: string;
    result: string;
    remark: string;
  }

  export { CheckStandard, CheckRecord };

  export function useCheckStore(): {
    standardList: CheckStandard[];
    currentStandard: CheckStandard | null;
    recordList: CheckRecord[];
    currentRecord: CheckRecord | null;
    
    // getters
    getStandardList: CheckStandard[];
    getCurrentStandard: CheckStandard | null;
    getRecordList: CheckRecord[];
    getCurrentRecord: CheckRecord | null;
    
    // actions
    fetchStandardList(): Promise<void>;
    fetchStandardDetail(id: string): Promise<CheckStandard>;
    saveStandard(standard: Partial<CheckStandard>): Promise<any>;
    deleteStandard(id: string): Promise<boolean>;
    fetchRecordList(): Promise<void>;
    fetchRecordDetail(id: string): Promise<CheckRecord>;
    saveRecord(record: Partial<CheckRecord>): Promise<any>;
    deleteRecord(id: string): Promise<boolean>;
  };
} 