export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      account_connections: {
        Row: {
          auth_code: string;
          created_at: string;
          id: string;
          session_id: string | null;
          updated_at: string;
          user_id: string;
          valid_until: string | null;
        };
        Insert: {
          auth_code: string;
          created_at?: string;
          id?: string;
          session_id?: string | null;
          updated_at?: string;
          user_id: string;
          valid_until?: string | null;
        };
        Update: {
          auth_code?: string;
          created_at?: string;
          id?: string;
          session_id?: string | null;
          updated_at?: string;
          user_id?: string;
          valid_until?: string | null;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          account_id: string;
          account_uid: string;
          balance_name: string | null;
          cash_account: boolean;
          country: string;
          created_at: string;
          currency: string;
          current_balance: number | null;
          iban: string;
          id: string;
          institution_name: string;
          product_name: string | null;
          synced_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          account_id: string;
          account_uid: string;
          balance_name?: string | null;
          cash_account?: boolean;
          country: string;
          created_at?: string;
          currency: string;
          current_balance?: number | null;
          iban: string;
          id?: string;
          institution_name: string;
          product_name?: string | null;
          synced_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          account_id?: string;
          account_uid?: string;
          balance_name?: string | null;
          cash_account?: boolean;
          country?: string;
          created_at?: string;
          currency?: string;
          current_balance?: number | null;
          iban?: string;
          id?: string;
          institution_name?: string;
          product_name?: string | null;
          synced_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          account_id: string;
          balance_after_transaction: Json | null;
          bank_transaction_code: Json | null;
          booking_date: string | null;
          composite_id: string | null;
          created_at: string;
          credit_debit_indicator: string | null;
          creditor: Json | null;
          creditor_account: Json | null;
          creditor_account_additional_identification: Json | null;
          creditor_agent: Json | null;
          debtor: Json | null;
          debtor_account: Json | null;
          debtor_account_additional_identification: Json | null;
          debtor_agent: Json | null;
          entry_reference: string | null;
          exchange_rate: Json | null;
          id: string;
          merchant_category_code: string | null;
          note: string | null;
          reference_number: string | null;
          remittance_information: string[] | null;
          status: string | null;
          transaction_amount: Json | null;
          transaction_category: string | null;
          transaction_date: string | null;
          transaction_id: string | null;
          updated_at: string;
          user_id: string;
          value_date: string | null;
        };
        Insert: {
          account_id: string;
          balance_after_transaction?: Json | null;
          bank_transaction_code?: Json | null;
          booking_date?: string | null;
          composite_id?: string | null;
          created_at?: string;
          credit_debit_indicator?: string | null;
          creditor?: Json | null;
          creditor_account?: Json | null;
          creditor_account_additional_identification?: Json | null;
          creditor_agent?: Json | null;
          debtor?: Json | null;
          debtor_account?: Json | null;
          debtor_account_additional_identification?: Json | null;
          debtor_agent?: Json | null;
          entry_reference?: string | null;
          exchange_rate?: Json | null;
          id?: string;
          merchant_category_code?: string | null;
          note?: string | null;
          reference_number?: string | null;
          remittance_information?: string[] | null;
          status?: string | null;
          transaction_amount?: Json | null;
          transaction_category?: string | null;
          transaction_date?: string | null;
          transaction_id?: string | null;
          updated_at?: string;
          user_id: string;
          value_date?: string | null;
        };
        Update: {
          account_id?: string;
          balance_after_transaction?: Json | null;
          bank_transaction_code?: Json | null;
          booking_date?: string | null;
          composite_id?: string | null;
          created_at?: string;
          credit_debit_indicator?: string | null;
          creditor?: Json | null;
          creditor_account?: Json | null;
          creditor_account_additional_identification?: Json | null;
          creditor_agent?: Json | null;
          debtor?: Json | null;
          debtor_account?: Json | null;
          debtor_account_additional_identification?: Json | null;
          debtor_agent?: Json | null;
          entry_reference?: string | null;
          exchange_rate?: Json | null;
          id?: string;
          merchant_category_code?: string | null;
          note?: string | null;
          reference_number?: string | null;
          remittance_information?: string[] | null;
          status?: string | null;
          transaction_amount?: Json | null;
          transaction_category?: string | null;
          transaction_date?: string | null;
          transaction_id?: string | null;
          updated_at?: string;
          user_id?: string;
          value_date?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          synced_at: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          synced_at?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          synced_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
