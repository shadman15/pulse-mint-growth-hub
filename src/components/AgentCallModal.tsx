import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Mic, PhoneOff, PhoneCall, Loader2, RotateCcw } from 'lucide-react';
import { BOOK_CALL_URL } from '../lib/links';

type Status = 'idle' | 'connecting' | 'live' | 'ended' | 'error';

const Ctx = createContext<{ openAgentCall: () => void }>({ openAgentCall: () => {} });
export const useAgentCall = () => useContext(Ctx);

const Bars: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex h-14 items-center justify-center gap-[3px]" aria-hidden="true">
    {Array.from({ length: 28 }).map((_, i) => (
      <span
        key={i}
        className={`w-[3px] rounded-full bg-gradient-to-t from-emerald-500 to-white/80 ${active ? 'pm-wave-bar' : ''}`}
        style={{
          height: `${active ? 14 + ((i * 37) % 36) : 4}px`,
          opacity: active ? 1 : 0.35,
          transition: 'height 0.3s, opacity 0.3s',
          animationDelay: `${(i % 8) * 0.11}s`,
          animationDuration: `${0.8 + (i % 5) * 0.15}s`,
        }}
      />
    ))}
  </div>
);

export const AgentCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [talking, setTalking] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [hint, setHint] = useState('');
  const clientRef = useRef<RetellWebClient | null>(null);

  const stop = useCallback(() => {
    try {
      clientRef.current?.stopCall();
    } catch {
      /* already stopped */
    }
    clientRef.current = null;
    setTalking(false);
  }, []);

  const start = useCallback(async () => {
    setError('');
    setCode('');
    setHint('');
    setStatus('connecting');
    try {
      // Host-neutral path. Cloudflare serves it from functions/api/, and
      // netlify.toml rewrites it to the Netlify function.
      const res = await fetch('/api/create-web-call', { method: 'POST' });
      if (!res.ok) {
        let reason = '';
        try {
          const body = await res.json();
          reason = body.reason || '';
          setHint(body.hint || '');
        } catch {
          /* not JSON, e.g. the function isn't deployed */
        }
        setCode(reason || `http_${res.status}`);
        throw new Error('token');
      }
      const { accessToken, callId, transport, iceServers } = await res.json();
      if (!accessToken) throw new Error('token');

      const client = new RetellWebClient();
      clientRef.current = client;
      client.on('call_started', () => setStatus('live'));
      client.on('call_ended', () => {
        setStatus('ended');
        setTalking(false);
        clientRef.current = null;
      });
      client.on('agent_start_talking', () => setTalking(true));
      client.on('agent_stop_talking', () => setTalking(false));
      client.on('error', () => {
        setError('The call dropped. Please try again.');
        setStatus('error');
        stop();
      });
      await client.startCall({ accessToken, callId, transport, iceServers });
    } catch (e) {
      console.error('[agent call]', e);
      const denied = e instanceof Error && /permission|denied|notallowed/i.test(e.name + e.message);
      setError(
        denied
          ? 'Microphone access is needed to talk to the agent. Allow it in your browser and try again.'
          : 'Couldn’t connect just now. Please try again in a moment.'
      );
      setStatus('error');
      stop();
    }
  }, [stop]);

  const openAgentCall = useCallback(() => {
    setOpen(true);
    start();
  }, [start]);

  const onOpenChange = (v: boolean) => {
    if (!v) {
      stop();
      setStatus('idle');
    }
    setOpen(v);
  };

  useEffect(() => () => stop(), [stop]);

  return (
    <Ctx.Provider value={{ openAgentCall }}>
      {children}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md border border-emerald-500/40 bg-gradient-to-br from-gray-900/95 via-black to-emerald-900/80 text-white p-8 sm:rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.25)]">
          <div className="text-center">
            <div className="text-xs tracking-[0.3em] text-emerald-400/90 mb-2">PULSEMINT AGENT</div>
            <DialogTitle className="text-2xl font-light tracking-[0.12em] text-white">
              {status === 'live' ? 'You’re talking to the agent' : status === 'ended' ? 'Call ended' : 'Test the agent'}
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm text-white/65 leading-relaxed">
              {status === 'connecting' && 'Connecting. Allow your microphone if your browser asks.'}
              {status === 'live' && 'Ask it anything about Pulsemint. Nobody will ring you back.'}
              {status === 'ended' && 'Thanks for trying it. Want one on your own number?'}
              {status === 'error' && error}
              {status === 'error' && code && (
                <span className="mt-2 block text-xs text-white/35">Reference: {code}{hint ? ` · ${hint}` : ''}</span>
              )}
              {status === 'idle' && ''}
            </DialogDescription>
          </div>

          <div className="my-6">
            {status === 'connecting' ? (
              <div className="flex h-14 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
              </div>
            ) : (
              <Bars active={status === 'live' && talking} />
            )}
            {status === 'live' && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs tracking-wider text-white/55">
                <Mic className="h-3.5 w-3.5 text-emerald-400" />
                {talking ? 'Agent speaking' : 'Listening'}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(status === 'live' || status === 'connecting') && (
              <button
                onClick={() => {
                  stop();
                  setStatus('ended');
                }}
                className="inline-flex items-center justify-center gap-2 rounded border border-red-400/40 bg-red-500/10 px-6 py-3 text-sm tracking-wider text-white transition-colors hover:bg-red-500/25"
              >
                <PhoneOff className="h-4 w-4" /> END CALL
              </button>
            )}
            {(status === 'error' || status === 'ended') && (
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 px-6 py-3 text-sm tracking-wider text-white transition-all hover:from-emerald-500/40 hover:to-emerald-400/40"
              >
                {status === 'error' ? <RotateCcw className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
                {status === 'error' ? 'TRY AGAIN' : 'CALL AGAIN'}
              </button>
            )}
            {status === 'ended' && (
              <a
                href={BOOK_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded border border-white/20 px-6 py-3 text-sm tracking-wider text-white transition-colors hover:bg-white/10"
              >
                BOOK A CALL
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
};
