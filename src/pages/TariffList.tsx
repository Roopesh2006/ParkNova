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
  Receipt,
  ChevronLeft,
  ChevronRight,
  Filter,
  Car,
  Clock,
  DollarSign,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

import { Tariff } from '../types/index';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api-client';

const columnHelper = createColumnHelper<Tariff>();

export default function TariffList() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [tariffs, setTariffs] = React.useState<Tariff[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTariffs = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch('/api/tariffs');
      setTariffs(data);
    } catch (error: any) {
      console.error('Error fetching tariffs:', error);
      toast.error(error.message || 'Failed to load tariffs');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTariffs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tariff?')) return;

    try {
      await apiFetch(`/api/tariffs/${id}`, {
        method: 'DELETE',
      });

      toast.success('Tariff deleted successfully');
      fetchTariffs();
    } catch (error: any) {
      console.error('Error deleting tariff:', error);
      toast.error(error.message || 'Failed to delete tariff');
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Tariff Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-primary">
            <Receipt size={20} />
          </div>
          <div className="font-bold text-text-1">{info.getValue()}</div>
        </div>
      ),
    }),
    columnHelper.accessor('place_id', {
      header: 'Place',
      cell: info => (
        <div className="flex items-center gap-2 text-text-2">
          <MapPin size={14} className="text-text-3" />
          {(info.row.original as any).place?.name || info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('category_id', {
      header: 'Category',
      cell: info => (
        <div className="flex items-center gap-2 text-text-2">
          <Car size={14} className="text-text-3" />
          {(info.row.original as any).category?.type || info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('min_amount', {
      header: 'Min Amount',
      cell: info => (
        <div className="flex items-center gap-1 text-text-1 font-medium">
          <DollarSign size={14} className="text-text-3" />
          ${Number(info.getValue()).toFixed(2)}
        </div>
      ),
    }),
    columnHelper.accessor('par_hour', {
      header: 'Hourly Rate',
      cell: info => (
        <div className="flex items-center gap-1 text-text-1 font-medium">
          <Clock size={14} className="text-text-3" />
          ${Number(info.getValue()).toFixed(2)}/hr
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            info.getValue() === 'enable' ? "bg-green" : "bg-red"
          )} />
          <span className={cn("capitalize", info.getValue() === 'enable' ? "text-green" : "text-red")}>
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/parking/tariff/edit/${info.row.original.id}`)}
            className="p-2 hover:bg-bg-surface rounded-lg text-text-3 hover:text-primary transition-colors"
          >
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
    data: tariffs,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Tariff Management</h2>
          <p className="text-text-3">Configure pricing and billing rates for each vehicle category</p>
        </div>
        <button 
          onClick={() => navigate('/parking/tariff/create')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add New Tariff
        </button>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" size={18} />
            <input 
              type="text"
              placeholder="Search tariffs..."
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
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-3 font-medium">Loading tariffs...</p>
            </div>
          ) : tariffs.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center text-text-3 mx-auto mb-4">
                <Receipt size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">No tariffs found</h3>
              <p className="text-text-3 mb-6">Start by adding your first pricing tariff.</p>
              <button 
                onClick={() => navigate('/parking/tariff/create')}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl"
              >
                Add Tariff
              </button>
            </div>
          ) : (
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
          )}
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="text-sm text-text-3">
            Showing <span className="text-text-1 font-bold">{table.getRowModel().rows.length}</span> of <span className="text-text-1 font-bold">{tariffs.length}</span> tariffs
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
