export interface RecordInfoType {
  date: string;
  category: string;
  title: string;
  payment: string;
  price: number;
}

export interface RecordType extends RecordInfoType {
  id: string;
}

export interface DayRecordsType {
  date: string;
  transaction: RecordType[];
}
