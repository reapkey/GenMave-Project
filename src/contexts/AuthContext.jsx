import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin, // This helps with email confirmation flow
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        return { data, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { data: null, error: err };
    }
  };


  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        return { data, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected login error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    // Clear localStorage
    localStorage.clear();
    
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  const deleteAccount = async () => {
    // Note: Account deletion should be handled server-side
    // This is a placeholder for the client-side trigger
    const { error } = await supabase.rpc('delete_user_account');
    if (!error) {
      await signOut();
    }
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
