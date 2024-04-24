import { Inter } from "next/font/google";
import "./globals.css";
import { InteractionProvider } from "./contexts/InteractionContext";
import { AuthProvider } from "./contexts/ContextDataCache";
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet" />
      </head>
          <body className={inter.className}>
            <video
            src="/assets/backgroundVideo.webm"
            type="video/webm"
            autoPlay
            loop
            muted
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: '-1',
            }}
            >
            </video>

            <LayoutComponents>
              {children}
            </LayoutComponents>
            </body>
          </html>
      </AuthProvider>

    </InteractionProvider>


  );
}
