'use client';

import BuildHeader from '@/components/pc-builder/BuildHeader';
import PartListTable from '@/components/pc-builder/PartListTable';

export default function PartListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BuildHeader />
      <PartListTable />
    </div>
  );
}
