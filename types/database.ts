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
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          username: string;
          avatar_url: string | null;
          country: string | null;
          city: string | null;
          bio: string | null;
          role: 'user' | 'admin';
          points: number;
          streak: number;
          rank: number | null;
          completed_count: number;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          username: string;
          avatar_url?: string | null;
          country?: string | null;
          city?: string | null;
          bio?: string | null;
          role?: 'user' | 'admin';
          points?: number;
          streak?: number;
          rank?: number | null;
          completed_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          username?: string;
          avatar_url?: string | null;
          country?: string | null;
          city?: string | null;
          bio?: string | null;
          role?: 'user' | 'admin';
          points?: number;
          streak?: number;
          rank?: number | null;
          completed_count?: number;
        };
        Relationships: [];
      };
      user_stats: {
        Row: {
          user_id: string;
          current_day: number;
          total_points: number;
          current_streak: number;
          longest_streak: number;
          completed_days: number;
          last_submission_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_day?: number;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          completed_days?: number;
          last_submission_date?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          current_day?: number;
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          completed_days?: number;
          last_submission_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          total_days: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          total_days?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          total_days?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      challenge_days: {
        Row: {
          id: string;
          challenge_id: string;
          day_number: number;
          theme: string;
          title: string;
          quote: string;
          author: string;
          action_prompt: string;
          reflection_prompt: string;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          day_number: number;
          theme: string;
          title: string;
          quote: string;
          author: string;
          action_prompt: string;
          reflection_prompt: string;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          day_number?: number;
          theme?: string;
          title?: string;
          quote?: string;
          author?: string;
          action_prompt?: string;
          reflection_prompt?: string;
          points?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_submissions: {
        Row: {
          id: string;
          user_id: string;
          day_id: string;
          day_number: number;
          action_completed: boolean;
          reflection_text: string | null;
          points_earned: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_id: string;
          day_number: number;
          action_completed: boolean;
          reflection_text?: string | null;
          points_earned: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          day_id?: string;
          day_number?: number;
          action_completed?: boolean;
          reflection_text?: string | null;
          points_earned?: number;
          submitted_at?: string;
        };
        Relationships: [];
      };
      points_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          reason?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon_name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon_name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon_name?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          day_number: number | null;
          likes_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          day_number?: number | null;
          likes_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          day_number?: number | null;
          likes_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      post_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          reaction_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          reaction_type?: string;
          created_at?: string;
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
      user_role: 'user' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type UserStats = Database['public']['Tables']['user_stats']['Row'];
export type ChallengeDay = Database['public']['Tables']['challenge_days']['Row'];
