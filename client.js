// src/client.ts
import { createThirdwebClient } from "thirdweb";

export const clientThirdweb = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_ID, // Get from your thirdweb dashboard
    secretKey: import.meta.env.VITE_THIRDWEB_KEY
  });
