import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { StateProvider } from './(backoffice)/state';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dashboard - Central Computer Improvement',
  description: 'Dashboard for managing Central Computer Improvement',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
      </head>
      <body className={inter.className}>
        <StateProvider>
          <Toaster position="top-center" />
          <Suspense
            fallback={
              <div className="text-center text-[32px] text-bluePallete-800">
                Loading...
              </div>
            }
          >
            {children}
          </Suspense>
        </StateProvider>
      </body>
    </html>
  );
};