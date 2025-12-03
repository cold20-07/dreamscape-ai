import { supabase } from "@/lib/supabaseClient";

export const authService = {
    // Send OTP to email for signup verification
    sendOtp: async (email: string) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            },
        });
        return { data, error };
    },

    // Verify OTP code
    verifyOtp: async (email: string, token: string) => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        return { data, error };
    },

    // Update user password (after OTP verification)
    updatePassword: async (password: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password,
        });
        return { data, error };
    },

    // Update user profile (name, etc.)
    updateProfile: async (name: string) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { name },
        });
        return { data, error };
    },

    // Sign in with email and password
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getUser: async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return user;
    },

    getSession: async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session;
    },
};
