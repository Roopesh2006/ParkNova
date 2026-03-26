import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  Layers, 
  Building2,
  CheckCircle2,
  Info,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

import { Place } from '../types/index';
import { apiFetch } from '../lib/api-client';

const floorSchema = z.object({
  name: z.string().min(1, 'Floor name is required'),
  floor_level: z.number().min(1, 'Floor level must be at least 1'),
  place_id: z.string().min(1, 'Please select a place'),
  remarks: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type FloorFormValues = z.infer<typeof floorSchema>;

export default function FloorCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [isFetchingPlaces, setIsFetchingPlaces] = React.useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      status: 'active',
      floor_level: 1,
    }
  });

  const selectedStatus = watch('status');

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

  const onSubmit = async (data: FloorFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/floors', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Floor created successfully', {
        description: `${data.name} has been added.`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/floors');
    } catch (error: any) {
      console.error('Error creating floor:', error);
      toast.error('Failed to create floor', {
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
            onClick={() => navigate('/parking/floors')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Add New Floor</h2>
            <p className="text-text-3">Create a new level or section for a parking facility</p>
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

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Floor Name</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('name')}
                      type="text"
                      placeholder="e.g. Basement 1, Level 2"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.name ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Remarks (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-text-3" size={18} />
                    <textarea 
                      {...register('remarks')}
                      placeholder="Special instructions or notes for this floor..."
                      rows={3}
                      className="w-full pl-12 pr-4 py-3.5 bg-bg-base border border-border rounded-xl text-text-1 focus:outline-none focus:border-primary transition-all resize-none"
                    />
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
            </div>

            <div className="p-8 bg-bg-surface border-t border-border flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/parking/floors')}
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
                    Save Floor
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
              Floor Setup
            </h4>
            <p className="text-sm text-text-2 leading-relaxed">
              Floors help organize your parking slots. You can:
            </p>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Assign specific vehicle categories to certain floors.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Track occupancy rates per level.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Manage maintenance status for entire sections.
              </li>
            </ul>
          </div>

          <div className="bg-accent-dim border border-accent/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <Layers size={20} />
              </div>
              <h4 className="font-display font-bold text-text-1">Capacity Planning</h4>
            </div>
            <p className="text-sm text-text-2 leading-relaxed">
              After creating a floor, you can proceed to "Parking Setup" to define individual slots within this floor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
