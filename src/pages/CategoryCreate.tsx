import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  Car, 
  Bike,
  Truck,
  Bus,
  CheckCircle2,
  Info,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Place } from '../types/index';
import { apiFetch } from '../lib/api-client';

const categorySchema = z.object({
  type: z.string().min(2, 'Category type must be at least 2 characters'),
  place_id: z.string().min(1, 'Please select a place'),
  description: z.string().optional(),
  sort_order: z.number().min(1, 'Sort order must be at least 1'),
  status: z.enum(['enable', 'disable']),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const vehicleIcons = [
  { name: 'Car', icon: Car },
  { name: 'Bike', icon: Bike },
  { name: 'Truck', icon: Truck },
  { name: 'Bus', icon: Bus },
];

export default function CategoryCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [isFetchingPlaces, setIsFetchingPlaces] = React.useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      status: 'enable',
      sort_order: 1,
    }
  });

  const selectedStatus = watch('status');
  const categoryType = watch('type');

  React.useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await apiFetch('/api/places');
        setPlaces(data);
      } catch (error: any) {
        console.error('Error fetching places:', error);
        toast.error(error.message || 'Failed to load places');
      } finally {
        setIsFetchingPlaces(false);
      }
    };
    fetchPlaces();
  }, []);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Category created successfully', {
        description: `${data.type} has been added as a vehicle category.`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/category');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category', {
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
            onClick={() => navigate('/parking/category')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Add New Category</h2>
            <p className="text-text-3">Define a new vehicle type for parking management</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Select Place</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <select 
                      {...register('place_id')}
                      disabled={isFetchingPlaces}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.place_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">{isFetchingPlaces ? 'Loading places...' : 'Choose a facility...'}</option>
                      {places.map(place => (
                        <option key={place.id} value={place.id}>{place.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.place_id && <p className="text-xs text-red font-medium">{errors.place_id.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Quick Select Type</label>
                  <div className="grid grid-cols-4 gap-3">
                    {vehicleIcons.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setValue('type', item.name)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                          categoryType === item.name 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-bg-base border-border text-text-3 hover:border-text-3"
                        )}
                      >
                        <item.icon size={24} />
                        <span className="text-xs font-bold">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Category Type</label>
                  <input 
                    {...register('type')}
                    type="text"
                    placeholder="e.g. Luxury Sedan"
                    className={cn(
                      "w-full px-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                      errors.type ? "border-red focus:border-red" : "border-border focus:border-primary"
                    )}
                  />
                  {errors.type && <p className="text-xs text-red font-medium">{errors.type.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Description</label>
                  <textarea 
                    {...register('description')}
                    placeholder="Describe the vehicle types in this category..."
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all resize-none",
                      errors.description ? "border-red focus:border-red" : "border-border focus:border-primary"
                    )}
                  />
                  {errors.description && <p className="text-xs text-red font-medium">{errors.description.message}</p>}
                </div>

                <div className="space-y-4">
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
                onClick={() => navigate('/parking/category')}
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
                    Save Category
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
              About Categories
            </h4>
            <p className="text-sm text-text-2 leading-relaxed">
              Vehicle categories allow you to:
            </p>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Set different pricing (tariffs) for different vehicle types.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Allocate specific floors or slots for certain vehicles.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Generate detailed revenue reports by vehicle type.
              </li>
            </ul>
          </div>

          <div className="bg-accent-dim border border-accent/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <Car size={20} />
              </div>
              <h4 className="font-display font-bold text-text-1">Dynamic Pricing</h4>
            </div>
            <p className="text-sm text-text-2 leading-relaxed">
              Categories are linked to Tariffs. Make sure to create a corresponding Tariff after defining a new category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
