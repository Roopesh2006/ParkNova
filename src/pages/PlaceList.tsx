import React from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

import { Place } from '../types/index';
import { apiFetch } from '../lib/api-client';

const columnHelper = createColumnHelper<Place>();

export default function PlaceList() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchPlaces = async () => {
    try {
      const data = await apiFetch('/api/places');
      setPlaces(data);
    } catch (error: any) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPlaces();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;
    
    try {
      await apiFetch(`/api/places/${id}`, { method: 'DELETE' });
      setPlaces(places.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting place:', error);
      alert(error.message || 'Failed to delete place');
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Place Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-primary">
            <Building2 size={20} />
          </div>
          <div className="font-bold text-text-1">{info.getValue()}</div>
        </div>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => (
        <div className="flex items-center gap-2 text-text-2 max-w-xs truncate">
          <MapPin size={14} className="text-text-3 shrink-0" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            info.getValue() === 'active' ? "bg-green shadow-[0_0_8px_var(--color-green)]" : "bg-red shadow-[0_0_8px_var(--color-red)]"
          )} />
          <span className={cn("capitalize", info.getValue() === 'active' ? "text-green" : "text-red")}>
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-bg-surface rounded-lg text-text-3 hover:text-primary transition-colors">
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(info.row.original.id)}
            className="p-2 hover:bg-bg-surface rounded-lg text-text-3 hover:text-red transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: places,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Place Management</h2>
          <p className="text-text-3">Manage your parking locations and facilities</p>
        </div>
        <button 
          onClick={() => navigate('/parking/places/create')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add New Place
        </button>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" size={18} />
            <input 
              type="text"
              placeholder="Search places..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border rounded-xl text-text-1 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-base border border-border rounded-xl text-text-2 hover:text-text-1 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-bg-surface/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-3 border-b border-border">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-bg-surface/30 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 border-b border-border/50">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="text-sm text-text-3">
            Showing <span className="text-text-1 font-bold">{table.getRowModel().rows.length}</span> of <span className="text-text-1 font-bold">{places.length}</span> places
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 bg-bg-base border border-border rounded-lg text-text-2 disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 bg-bg-base border border-border rounded-lg text-text-2 disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
