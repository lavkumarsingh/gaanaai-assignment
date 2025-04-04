'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from "react-hot-toast";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again.</div>}
      onError={(error: Error) => console.error('Root Error:', error)}
    >
      <Toaster position="top-right" />
      {children}
    </ErrorBoundary>
  );
}
