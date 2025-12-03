import { supabase } from "@/lib/supabaseClient";

export const authService = {
    signUp: async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });
        return { data, error };
    },

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
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    getSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }
};
