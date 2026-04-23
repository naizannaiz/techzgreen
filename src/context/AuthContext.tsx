import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profileRole: 'admin' | 'user' | null;
  totalPoints: number;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshPoints: () => Promise<void>;  // ← NEW: pages can call this to get live points
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profileRole: null,
  totalPoints: 0,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  refreshPoints: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileRole, setProfileRole] = useState<'admin' | 'user' | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch points directly from points_ledger (sum of all changes)
  const fetchPoints = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('points_ledger')
      .select('points_change')
      .eq('user_id', userId);

    if (!error && data) {
      const sum = data.reduce((acc: number, row: any) => acc + (row.points_change || 0), 0);
      setTotalPoints(Math.max(0, sum));
    }
  }, []);

  const fetchProfileAndPoints = useCallback(async (userId: string) => {
    try {
      setCurrentUserId(userId);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profile) setProfileRole(profile.role);

      await fetchPoints(userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchPoints]);

  // Called externally by pages after points-changing actions
  const refreshPoints = useCallback(async () => {
    if (!currentUserId) return;
    await fetchPoints(currentUserId);
  }, [currentUserId, fetchPoints]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndPoints(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndPoints(session.user.id);
      } else {
        setProfileRole(null);
        setTotalPoints(0);
        setCurrentUserId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileAndPoints]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, profileRole, totalPoints, loading, signOut, signInWithGoogle, refreshPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
