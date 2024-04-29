"use client"

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const Provider = ({ children }) => {
    const [client] = useState(new QueryClient(
        //desativar o refetch automatico
        //salvar o estado do cache
        { defaultOptions: { 
            queries: { 
                refetchOnWindowFocus: false
            },
            mutations:{
                
            }
        } }
    ));

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
} 

export default Provider;