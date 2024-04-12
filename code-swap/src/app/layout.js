import { Inter } from "next/font/google";
import "./globals.css";
import { InteractionProvider } from "./contexts/InteractionContext";
import { AuthProvider } from "./contexts/Auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Swap",
  description: "Plataforma de Cursos Online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="Pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      <InteractionProvider>

        <AuthProvider>
          <body className={inter.className}>{children}</body>
        </AuthProvider>
        
      </InteractionProvider>
      
    </html>
  );
}
