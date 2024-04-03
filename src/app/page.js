'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  // OurRedirect('./dashboard');
  //   router.replace('/login'); // Mengarahkan pengguna dari / ke /login

  useEffect(() => {
    router.push('/login'); // Mengarahkan pengguna dari / ke /login
    // OurRedirect('./dashboard');
  }, [router]); // Komponen ini hanya dijalankan sekali setelah mounting

  return null; // Atau tampilkan pesan atau komponen lain jika perlu
}
