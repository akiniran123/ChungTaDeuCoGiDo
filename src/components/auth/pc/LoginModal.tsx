'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function GuestSignIn() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [upserting, setUpserting] = useState(false);
  const mountedRef = useRef(true);

  // Helper: upsert profile safely
  const upsertProfile = async (u: User, nicknameValue?: string) => {
    if (!u?.id) return;
    setUpserting(true);
    try {
      const payload = {
        id: u.id,
        email: u.email ?? null,
        nickname: (nicknameValue?.trim() || (u.user_metadata as any)?.name || null),
      };
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      console.log('Profile upserted for', u.id);
    } catch (err) {
      console.error('Profile upsert error', err);
    } finally {
      if (mountedRef.current) setUpserting(false);
    }
  };

  // Initialize user and handle session-from-url (if needed)
  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      try {
        // Some supabase-js versions require finishing OAuth redirect
        if (typeof window !== 'undefined' && window.location.search.includes('access_token')) {
          if (typeof (supabase.auth as any).getSessionFromUrl === 'function') {
            try {
              await (supabase.auth as any).getSessionFromUrl({ storeSession: true });
            } catch (e) {
              console.warn('getSessionFromUrl warning', e);
            }
          }
        }

        const { data } = await supabase.auth.getUser();
        if (!mountedRef.current) return;
        setUser(data?.user ?? null);
      } catch (e) {
        console.error('getUser error', e);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mountedRef.current = false;
      try {
        listener.subscription.unsubscribe();
      } catch {}
    };
  }, []);

  // Upsert when SIGNED_IN event occurs (use onAuthStateChange to catch it)
  useEffect(() => {
    let unsub: { subscription: { unsubscribe: () => void } } | null = null;

    const subscribe = () => {
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        const u = session?.user ?? null;
        setUser(u);

        if (event === 'SIGNED_IN' && u) {
          // Use the current nickname input if provided, otherwise fallback to user_metadata.name
          await upsertProfile(u, nickname);
        }
      });
      unsub = listener;
    };

    subscribe();

    return () => {
      try {
        unsub?.subscription.unsubscribe();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Google OAuth redirect flow
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Use the same callback route you configured in Supabase (e.g., /auth/callback)
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

      // Support both new and older supabase-js APIs
      if (typeof (supabase as any).auth.signInWithOAuth === 'function') {
        const res = await (supabase as any).auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo, queryParams: { prompt: 'select_account' } },
        });
        console.log('signInWithOAuth response', res);
        if (res?.error) throw res.error;
        // redirect will occur; on return, onAuthStateChange will handle upsert
      } else if (typeof (supabase as any).auth.signIn === 'function') {
        const res = await (supabase as any).auth.signIn({
          provider: 'google',
          options: { redirectTo, queryParams: { prompt: 'select_account' } } as any,
        } as any);
        console.log('signIn (fallback) response', res);
        if (res?.error) throw res.error;
      } else {
        throw new Error('Supabase auth method for OAuth not found. Update @supabase/supabase-js.');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      alert('Google sign-in failed: ' + (err?.message ?? JSON.stringify(err)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Optional anonymous sign-in (kept as fallback)
  const signInAnonymous = async () => {
    try {
      setLoading(true);
      const res = await (supabase as any).auth.signInAnonymously?.();
      console.log('Anonymous response', res);
      const u = res?.data?.user ?? res?.user ?? res?.session?.user ?? null;
      if (!u) throw new Error('Anonymous sign-in did not return a user');
      setUser(u);
      // upsert immediately for anonymous
      await upsertProfile(u, nickname);
    } catch (err: any) {
      console.error('Anonymous sign-in error (detailed):', err);
      alert('Sign-in failed: ' + (err?.message ?? JSON.stringify(err)));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (e) {
      console.error('signOut error', e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded bg-white shadow">
      {user ? (
        <div>
          <p className="mb-2">Signed in as <strong>{user.id}</strong></p>
          <p className="mb-2 text-sm text-gray-600">Email: {user.email ?? '—'}</p>
          <button onClick={signOut} className="px-4 py-2 bg-red-500 text-white rounded">Sign out</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Choose a nickname (optional)"
            className="border px-3 py-2 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <button
              onClick={signInAnonymous}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? 'Signing in...' : 'Join as Guest'}
            </button>
          </div>

          {upserting && <p className="text-xs text-gray-500">Saving profile...</p>}
          <p className="text-xs text-gray-500">You can convert this guest to a full account later.</p>
        </div>
      )}
    </div>
  );
}