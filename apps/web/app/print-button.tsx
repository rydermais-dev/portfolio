'use client';
import { Button } from '@moduix/react/button';
export function PrintButton({ label }: { label: string }) {
  return <Button type="button" className="ui-button ui-button--primary print-button" onClick={() => window.print()}>{label}</Button>;
}
