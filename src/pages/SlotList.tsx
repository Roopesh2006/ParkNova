import React from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getSortedRowModel, 
  getFilteredRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  MapPin,
  Layers,
  Car
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ParkingSlot } from '../types/index';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api-client';

const columnHelper = createColumnHelper<ParkingSlot>();

export default function SlotList() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [slots, setSlots] = React.useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch('/api/slots');
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load slots');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSlots();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      await apiFetch(`/api/slots/${id}`, {
        method: 'DELETE',
      });

      toast.success('Slot deleted successfully');
      fetchSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete slot');
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Slot Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-primary">
            <Grid size={20} />
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
    columnHelper.accessor('floor_id', {
      header: 'Floor',
      cell: info => (
        <div className="flex items-center gap-2 text-text-2">
          <Layers size={14} className="text-text-3" />
          {(info.row.original as any).floor?.name || info.getValue()}
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
    columnHelper.accessor('is_occupied', {
      header: 'Availability',
      cell: info => (
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5",
          !info.getValue() 
            ? "bg-green/10 text-green border border-green/20" 
            : "bg-red/10 text-red border border-red/20"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", !info.getValue() ? "bg-green" : "bg-red")} />
          {!info.getValue() ? 'Available' : 'Occupied'}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            info.getValue() === 'active' ? "bg-green" : "bg-red"
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
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/parking/slot/edit/${info.row.original.id}`)}
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
          <button className="p-2 hover:bg-bg-surface rounded-lg text-text-3 hover:text-text-1 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: slots,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Slot Management</h2>
          <p className="text-text-3">Monitor and manage individual parking slots</p>
        </div>
        <button 
          onClick={() => navigate('/parking/slot-create')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Add New Slot
        </button>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border bg-bg-surface/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
            <input 
              type="text"
              placeholder="Search slots..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-bg-base border border-border rounded-xl text-text-1 focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-3">Show</span>
            <select 
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="bg-bg-base border border-border rounded-lg px-2 py-1 text-text-1 focus:outline-none focus:border-primary"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))}
            </select>
            <span className="text-sm text-text-3">entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-3 font-medium">Loading slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center text-text-3 mx-auto mb-4">
                <Grid size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">No slots found</h3>
              <p className="text-text-3 mb-6">Start by adding your first parking slot.</p>
              <button 
                onClick={() => navigate('/parking/slot-create')}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl"
              >
                Add Slot
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-border bg-bg-surface/30">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-3">
                        {header.isPlaceholder ? null : (
                          <div 
                            className={cn(
                              "flex items-center gap-2",
                              header.column.getCanSort() && "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border hover:bg-bg-surface/50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 border-t border-border bg-bg-surface/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm text-text-3">
            Showing <span className="text-text-1 font-bold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="text-text-1 font-bold">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, slots.length)}</span> of <span className="text-text-1 font-bold">{slots.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg border border-border text-text-3 hover:text-primary disabled:opacity-30 disabled:hover:text-text-3 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={cn(
                    "w-10 h-10 rounded-lg border font-bold transition-all",
                    table.getState().pagination.pageIndex === i 
                      ? "bg-primary border-primary text-white" 
                      : "border-border text-text-3 hover:border-text-3"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg border border-border text-text-3 hover:text-primary disabled:opacity-30 disabled:hover:text-text-3 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
