export type UserRole = 'admin' | 'operator';
export type UserStatus = 'Active' | 'Deactive';

export interface User {
  id: string;
  client_id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  language: string;
  created_at: string;
}

export interface Place {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface VehicleCategory {
  id: string;
  client_id: string;
  place_id: string;
  type: string;
  description?: string;
  status: 'enable' | 'disable';
  sort_order: number;
}

export interface Floor {
  id: string;
  client_id: string;
  place_id: string;
  name: string;
  floor_level: number;
  remarks?: string;
  status: 'active' | 'inactive';
}

export interface ParkingSlot {
  id: string;
  client_id: string;
  place_id: string;
  floor_id: string;
  category_id: string;
  name: string;
  identity?: string;
  remarks?: string;
  status: 'active' | 'inactive';
  is_occupied: boolean;
}

export interface Tariff {
  id: string;
  client_id: string;
  place_id: string;
  category_id: string;
  name: string;
  start_date: string;
  end_date: string;
  min_amount: number;
  par_hour: number;
  status: 'enable' | 'disable';
}

export interface ParkingSession {
  id: string;
  client_id: string;
  barcode: string;
  place_id: string;
  slot_id: string;
  category_id: string;
  vehicle_no: string;
  driver_name?: string;
  driver_mobile?: string;
  rfid_code?: string;
  in_time: string;
  out_time?: string;
  duration_hours?: number;
  payable_amount?: number;
  receive_amount?: number;
  paid_amount?: number;
  return_amount?: number;
  exit_floor_id?: string;
  status: 'active' | 'ended' | 'cancelled';
}
