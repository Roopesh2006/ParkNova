import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  Grid,
  MapPin,
  Layers,
  Car,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api-client';

const slotSchema = z.object({
  name: z.string().min(1, 'Slot name is required'),
  place_id: z.string().min(1, 'Please select a place'),
  floor_id: z.string().min(1, 'Please select a floor'),
  category_id: z.string().min(1, 'Please select a category'),
  status: z.enum(['active', 'inactive']),
});

type SlotFormValues = z.infer<typeof slotSchema>;

export default function SlotCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [places, setPlaces] = React.useState<{ id: string; name: string }[]>([]);
  const [floors, setFloors] = React.useState<{ id: string; name: string; place_id: string }[]>([]);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SlotFormValues>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      status: 'active',
    }
  });

  const selectedStatus = watch('status');
  const selectedPlace = watch('place_id');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesData, floorsData, categoriesData] = await Promise.all([
          apiFetch('/api/places'),
          apiFetch('/api/floors'),
          apiFetch('/api/categories')
        ]);

        setPlaces(placesData);
        setFloors(floorsData);
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Failed to load required data');
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: SlotFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/slots', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Slot created successfully', {
        description: `Slot ${data.name} has been added to the system.`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/slot');
    } catch (error: any) {
      console.error('Error creating slot:', error);
      toast.error(error.message || 'Failed to create slot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/parking/slot')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Add New Slot</h2>
            <p className="text-text-3">Define a new parking space in the system</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Slot Name</label>
                  <div className="relative">
                    <Grid className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('name')}
                      type="text"
                      placeholder="e.g. A-101"
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
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.place_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">Select Place</option>
                      {places.map(place => (
                        <option key={place.id} value={place.id}>{place.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.place_id && <p className="text-xs text-red font-medium">{errors.place_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Floor</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <select 
                      {...register('floor_id')}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.floor_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">Select Floor</option>
                      {floors.filter(f => !selectedPlace || f.place_id === selectedPlace).map(floor => (
                        <option key={floor.id} value={floor.id}>{floor.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.floor_id && <p className="text-xs text-red font-medium">{errors.floor_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Vehicle Category</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <select 
                      {...register('category_id')}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.category_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.category_id && <p className="text-xs text-red font-medium">{errors.category_id.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3">Initial Status</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('status', 'active')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                      selectedStatus === 'active' 
                        ? "bg-green/10 border-green text-green shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                        : "bg-bg-base border-border text-text-3 hover:text-text-2"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", selectedStatus === 'active' ? "bg-green" : "bg-text-3")} />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('status', 'inactive')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                      selectedStatus === 'inactive' 
                        ? "bg-red/10 border-red text-red shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                        : "bg-bg-base border-border text-text-3 hover:text-text-2"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", selectedStatus === 'inactive' ? "bg-red" : "bg-text-3")} />
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-bg-surface border-t border-border flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/parking/slot')}
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
                    Create Slot
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
            <h4 className="font-display font-bold text-text-1 flex items-center gap-2">
              <Grid size={18} className="text-primary" />
              Slot Configuration
            </h4>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Slots are grouped by floor and place.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Each slot must be assigned a vehicle category (Car, Bike, etc.).
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Inactive slots cannot be used for new parking entries.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
