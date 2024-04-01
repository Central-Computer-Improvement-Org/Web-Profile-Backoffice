'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import OurRedirect from './utils/OurRedirect';

export default function Index() {
  const router = useRouter();

  OurRedirect('./login');

  // useEffect(() => {
  //    // router.replace('/login'); // Mengarahkan pengguna dari / ke /login
  //    OurRedirect('./dashboard');
  // }, []); // Komponen ini hanya dijalankan sekali setelah mounting

  return null; // Atau tampilkan pesan atau komponen lain jika perlu
}
