
import { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";

type SessionContextType = {
  session: Session | null;
  loading: boolean;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: false,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContext.Provider value={{ session: null, loading: false }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
