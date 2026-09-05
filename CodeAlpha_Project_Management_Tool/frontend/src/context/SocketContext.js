import { createContext, useContext } from 'react';

const SocketContext = createContext(null);
export const SocketProvider = SocketContext.Provider;
export const useSocket = () => useContext(SocketContext);