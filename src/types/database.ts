export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      places: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          password_hash: string
          role: 'admin' | 'operator'
          language: string | null
          status: 'Active' | 'Deactive'
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password_hash: string
          role: 'admin' | 'operator'
          language?: string | null
          status?: 'Active' | 'Deactive'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password_hash?: string
          role?: 'admin' | 'operator'
          language?: string | null
          status?: 'Active' | 'Deactive'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_categories: {
        Row: {
          id: string
          place_id: string | null
          type: string
          description: string | null
          status: 'enable' | 'disable'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id?: string | null
          type: string
          description?: string | null
          status?: 'enable' | 'disable'
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string | null
          type?: string
          description?: string | null
          status?: 'enable' | 'disable'
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      floors: {
        Row: {
          id: string
          place_id: string | null
          name: string
          floor_level: number
          remarks: string | null
          status: 'active' | 'inactive'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id?: string | null
          name: string
          floor_level?: number
          remarks?: string | null
          status?: 'active' | 'inactive'
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string | null
          name?: string
          floor_level?: number
          remarks?: string | null
          status?: 'active' | 'inactive'
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      parking_slots: {
        Row: {
          id: string
          place_id: string | null
          floor_id: string | null
          category_id: string | null
          name: string
          identity: string | null
          remarks: string | null
          status: 'active' | 'inactive'
          is_occupied: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id?: string | null
          floor_id?: string | null
          category_id?: string | null
          name: string
          identity?: string | null
          remarks?: string | null
          status?: 'active' | 'inactive'
          is_occupied?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string | null
          floor_id?: string | null
          category_id?: string | null
          name?: string
          identity?: string | null
          remarks?: string | null
          status?: 'active' | 'inactive'
          is_occupied?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tariffs: {
        Row: {
          id: string
          place_id: string | null
          category_id: string | null
          name: string
          start_date: string
          end_date: string
          min_amount: number
          par_hour: number
          status: 'enable' | 'disable'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id?: string | null
          category_id?: string | null
          name: string
          start_date: string
          end_date: string
          min_amount?: number
          par_hour?: number
          status?: 'enable' | 'disable'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string | null
          category_id?: string | null
          name?: string
          start_date?: string
          end_date?: string
          min_amount?: number
          par_hour?: number
          status?: 'enable' | 'disable'
          created_at?: string
          updated_at?: string
        }
      }
      parking_sessions: {
        Row: {
          id: string
          barcode: string
          place_id: string | null
          slot_id: string | null
          category_id: string | null
          vehicle_no: string
          driver_name: string | null
          driver_mobile: string | null
          rfid_code: string | null
          checked_in_by: string | null
          checked_out_by: string | null
          in_time: string
          out_time: string | null
          duration_hours: number | null
          payable_amount: number | null
          receive_amount: number | null
          paid_amount: number | null
          return_amount: number | null
          exit_floor_id: string | null
          status: 'active' | 'ended' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barcode: string
          place_id?: string | null
          slot_id?: string | null
          category_id?: string | null
          vehicle_no: string
          driver_name?: string | null
          driver_mobile?: string | null
          rfid_code?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          in_time?: string
          out_time?: string | null
          duration_hours?: number | null
          payable_amount?: number | null
          receive_amount?: number | null
          paid_amount?: number | null
          return_amount?: number | null
          exit_floor_id?: string | null
          status?: 'active' | 'ended' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barcode?: string
          place_id?: string | null
          slot_id?: string | null
          category_id?: string | null
          vehicle_no?: string
          driver_name?: string | null
          driver_mobile?: string | null
          rfid_code?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          in_time?: string
          out_time?: string | null
          duration_hours?: number | null
          payable_amount?: number | null
          receive_amount?: number | null
          paid_amount?: number | null
          return_amount?: number | null
          exit_floor_id?: string | null
          status?: 'active' | 'ended' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          updated_at?: string
        }
      }
      languages: {
        Row: {
          id: string
          code: string
          name: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          is_default?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_operator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
