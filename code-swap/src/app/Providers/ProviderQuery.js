"use client"

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const Provider = ({ children }) => {
    const [client] = useState(new QueryClient(
        //desativar o refetch automatico
        //salvar o estado do cache
        { defaultOptions: { 
            queries: { 
                refetchOnWindowFocus: false,
                cacheTime: 1000 * 60 * 60 * 24 // 24 horas
            },
            mutations:{
                
            }
        } }
    ));

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
} 

export default Provider;