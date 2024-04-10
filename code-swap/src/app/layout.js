import { Inter } from "next/font/google";
import "./globals.css";
import { InteractionProvider } from "./contexts/InteractionContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Swap",
  description: "Plataforma de Cursos Online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="Pt-br">
      <InteractionProvider>
        <body className={inter.className}>{children}</body>
      </InteractionProvider>
      
    </html>
  );
}
