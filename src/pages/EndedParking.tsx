import React from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import { 
  Search, 
  ArrowUpDown, 
  MoreVertical, 
  Clock, 
  Car,
  MapPin,
  Layers,
  Grid,
  ChevronLeft,
  ChevronRight,
  Filter,
  Receipt,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { apiFetch } from '../lib/api-client';

interface EndedParkingEntry {
  id: string;
  vehicle_no: string;
  place_name: string;
  floor_name: string;
  category_name: string;
  slot_name: string;
  in_time: string;
  out_time: string;
  total_amount: number;
  payment_method: string;
  status: 'ended';
}

const columnHelper = createColumnHelper<EndedParkingEntry>();

export default function EndedParking() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [entries, setEntries] = React.useState<EndedParkingEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await apiFetch('/api/parking/sessions/ended');
        setEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const columns = [
    columnHelper.accessor('vehicle_no', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-primary transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Vehicle No
          <ArrowUpDown size={14} />
        </button>
      ),
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Car size={20} />
          </div>
          <span className="font-mono font-bold text-text-1 tracking-wider uppercase">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('place_name', {
      header: 'Location',
      cell: info => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-text-1 font-medium">
            <MapPin size={14} className="text-text-3" />
            {info.getValue()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-3">
            <Layers size={12} />
            {info.row.original.floor_name}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('slot_name', {
      header: 'Slot',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-bg-base border border-border text-xs font-bold text-primary flex items-center gap-1.5">
            <Grid size={12} />
            {info.getValue()}
          </div>
          <span className="text-xs text-text-3">{info.row.original.category_name}</span>
        </div>
      ),
    }),
    columnHelper.accessor('in_time', {
      header: 'Stay Duration',
      cell: info => {
        const inTime = new Date(info.getValue());
        const outTime = new Date(info.row.original.out_time);
        const durationMs = outTime.getTime() - inTime.getTime();
        const h = Math.floor(durationMs / (1000 * 60 * 60));
        const m = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return (
          <div className="space-y-1">
            <div className="text-sm text-text-1 font-medium">{h}h {m}m</div>
            <div className="flex items-center gap-1 text-[10px] text-text-3 uppercase tracking-wider">
              <Calendar size={10} />
              {format(inTime, 'MMM dd')} - {format(outTime, 'MMM dd')}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('total_amount', {
      header: 'Amount',
      cell: info => (
        <div className="space-y-1">
          <div className="text-sm text-text-1 font-bold flex items-center gap-1">
            <DollarSign size={14} className="text-text-3" />
            {Number(info.getValue()).toFixed(2)}
          </div>
          <div className="text-[10px] text-text-3 uppercase tracking-widest font-bold">
            {info.row.original.payment_method}
          </div>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-3 hover:text-primary transition-colors">
            <Receipt size={18} />
          </button>
          <button className="p-2 text-text-3 hover:text-text-1 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: entries,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
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
          <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Ended Parking</h2>
          <p className="text-text-3">History of all completed parking sessions and payments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-bg-card border border-border rounded-xl flex items-center gap-2 text-text-2 font-bold">
            <Clock size={18} className="text-primary" />
            <span>{entries.length} Total Sessions</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-surface/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
            <input
              type="text"
              placeholder="Search history..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-bg-base border border-border rounded-xl text-text-1 focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-base border border-border rounded-xl text-text-2 hover:text-text-1 transition-all">
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-3 font-medium">Loading history...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center text-text-3">
                <Receipt size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-1">No history found</h3>
                <p className="text-text-3 max-w-xs mx-auto">There are no completed parking sessions in the system yet.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-bg-surface/30">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-3 border-b border-border">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-bg-elevated/50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && entries.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-between bg-bg-surface/30">
            <div className="text-sm text-text-3 font-medium">
              Showing <span className="text-text-1">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="text-text-1">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, entries.length)}</span> of <span className="text-text-1">{entries.length}</span> entries
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
                      "w-8 h-8 rounded-lg text-sm font-bold transition-all",
                      table.getState().pagination.pageIndex === i
                        ? "bg-primary text-white"
                        : "text-text-3 hover:bg-bg-elevated hover:text-text-1"
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
        )}
      </div>
    </div>
  );
}
