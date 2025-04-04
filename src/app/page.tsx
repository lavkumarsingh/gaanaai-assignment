'use client';

import React from 'react';
import PortTable from '@/components/PortTable';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Ports Data Table</h1>
      <PortTable />
    </main>
  );
}
