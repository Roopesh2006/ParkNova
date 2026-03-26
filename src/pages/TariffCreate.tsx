import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  Receipt, 
  Car, 
  DollarSign,
  Clock,
  CheckCircle2,
  Info,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

import { Place, VehicleCategory } from '../types/index';
import { apiFetch } from '../lib/api-client';

const tariffSchema = z.object({
  name: z.string().min(2, 'Tariff name is required'),
  place_id: z.string().min(1, 'Please select a place'),
  category_id: z.string().min(1, 'Please select a category'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  min_amount: z.number().min(0, 'Min amount must be at least 0'),
  par_hour: z.number().min(0, 'Rate must be at least 0'),
  status: z.enum(['enable', 'disable']),
});

type TariffFormValues = z.infer<typeof tariffSchema>;

export default function TariffCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [categories, setCategories] = React.useState<VehicleCategory[]>([]);
  const [isFetchingData, setIsFetchingData] = React.useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TariffFormValues>({
    resolver: zodResolver(tariffSchema),
    defaultValues: {
      status: 'enable',
      min_amount: 0,
      par_hour: 0,
    }
  });

  const selectedStatus = watch('status');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesData, categoriesData] = await Promise.all([
          apiFetch('/api/places'),
          apiFetch('/api/categories')
        ]);
        
        setPlaces(placesData);
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Failed to load required data');
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: TariffFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/tariffs', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Tariff created successfully', {
        description: `${data.name} has been added to the system.`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/tariff');
    } catch (error: any) {
      console.error('Error creating tariff:', error);
      toast.error('Failed to create tariff', {
        description: error.message || 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/parking/tariff')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Add New Tariff</h2>
            <p className="text-text-3">Define pricing rules and hourly rates for parking</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Tariff Name</label>
                  <div className="relative">
                    <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('name')}
                      type="text"
                      placeholder="e.g. Standard Hourly Rate"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.name ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Place</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <select 
                      {...register('place_id')}
                      disabled={isFetchingData}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.place_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">{isFetchingData ? 'Loading places...' : 'Select place...'}</option>
                      {places.map(place => (
                        <option key={place.id} value={place.id}>{place.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.place_id && <p className="text-xs text-red font-medium">{errors.place_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Vehicle Category</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <select 
                      {...register('category_id')}
                      disabled={isFetchingData}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.category_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">{isFetchingData ? 'Loading categories...' : 'Select category...'}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.category_id && <p className="text-xs text-red font-medium">{errors.category_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Start Date</label>
                  <input 
                    {...register('start_date')}
                    type="date"
                    className={cn(
                      "w-full px-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                      errors.start_date ? "border-red focus:border-red" : "border-border focus:border-primary"
                    )}
                  />
                  {errors.start_date && <p className="text-xs text-red font-medium">{errors.start_date.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">End Date</label>
                  <input 
                    {...register('end_date')}
                    type="date"
                    className={cn(
                      "w-full px-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                      errors.end_date ? "border-red focus:border-red" : "border-border focus:border-primary"
                    )}
                  />
                  {errors.end_date && <p className="text-xs text-red font-medium">{errors.end_date.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Minimum Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('min_amount', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.min_amount ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.min_amount && <p className="text-xs text-red font-medium">{errors.min_amount.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Hourly Rate ($)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('par_hour', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.par_hour ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.par_hour && <p className="text-xs text-red font-medium">{errors.par_hour.message}</p>}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Initial Status</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setValue('status', 'enable')}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                        selectedStatus === 'enable' 
                          ? "bg-green/10 border-green text-green shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                          : "bg-bg-base border-border text-text-3 hover:text-text-2"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", selectedStatus === 'enable' ? "bg-green" : "bg-text-3")} />
                      Enable
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('status', 'disable')}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                        selectedStatus === 'disable' 
                          ? "bg-red/10 border-red text-red shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                          : "bg-bg-base border-border text-text-3 hover:text-text-2"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", selectedStatus === 'disable' ? "bg-red" : "bg-text-3")} />
                      Disable
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-bg-surface border-t border-border flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/parking/tariff')}
                className="px-6 py-3 text-text-2 font-bold hover:text-text-1 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Save Tariff
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
            <h4 className="font-display font-bold text-text-1 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              Tariff Logic
            </h4>
            <p className="text-sm text-text-2 leading-relaxed">
              How billing is calculated:
            </p>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="font-bold text-text-1">Minimum Amount:</span> The base fee charged as soon as a vehicle enters.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="font-bold text-text-1">Hourly Rate:</span> The additional fee charged for every hour of stay.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Total = Min Amount + (Hours × Hourly Rate)
              </li>
            </ul>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red/10 rounded-xl flex items-center justify-center text-red">
                <AlertCircle size={20} />
              </div>
              <h4 className="font-display font-bold text-text-1">Important Note</h4>
            </div>
            <p className="text-sm text-text-2 leading-relaxed">
              Changes to tariffs will only apply to new parking entries. Existing parked vehicles will be billed based on the tariff active at their entry time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
