import { Inter } from "next/font/google";
import "./globals.css";
import { InteractionProvider } from "./contexts/InteractionContext";
import { AuthProvider } from "./contexts/Auth";
import LayoutComponents from "./Components/LayoutComponents";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Swap",
  description: "Plataforma de Cursos Online",
};

export default function RootLayout({ children }) {
  return (


    <InteractionProvider>

      <AuthProvider>

        <html lang="Pt-br">
          <head>
            <link rel="icon" href="/favicon.ico" />
          </head>

          <body className={inter.className}>
            <LayoutComponents>
              {children}
            </LayoutComponents>

          </body>


        </html>
      </AuthProvider>

    </InteractionProvider>


  );
}
