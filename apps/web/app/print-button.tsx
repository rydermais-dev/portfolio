'use client';
import { Button } from '@moduix/react/button';
export function PrintButton({ label }: { label: string }) {
  return <Button type="button" className="print-button" onClick={() => window.print()}>{label}</Button>;
}
