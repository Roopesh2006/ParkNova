import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  Car,
  MapPin,
  Layers,
  Grid,
  User,
  Phone,
  Clock,
  CheckCircle2,
  Barcode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api-client';

const parkingEntrySchema = z.object({
  place_id: z.string().min(1, 'Please select a place'),
  floor_id: z.string().min(1, 'Please select a floor'),
  category_id: z.string().min(1, 'Please select a category'),
  slot_id: z.string().min(1, 'Please select a slot'),
  vehicle_no: z.string().min(3, 'Vehicle number is required'),
  driver_name: z.string().optional(),
  driver_mobile: z.string().optional(),
});

type ParkingEntryFormValues = z.infer<typeof parkingEntrySchema>;

export default function AddParking() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [places, setPlaces] = React.useState<{ id: string; name: string }[]>([]);
  const [floors, setFloors] = React.useState<{ id: string; name: string; place_id: string }[]>([]);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);
  const [slots, setSlots] = React.useState<{ id: string; name: string; floor_id: string; is_occupied: boolean }[]>([]);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ParkingEntryFormValues>({
    resolver: zodResolver(parkingEntrySchema),
  });

  const selectedPlace = watch('place_id');
  const selectedFloor = watch('floor_id');
  const selectedCategory = watch('category_id');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesData, floorsData, categoriesData, slotsData] = await Promise.all([
          apiFetch('/api/places'),
          apiFetch('/api/floors'),
          apiFetch('/api/categories'),
          apiFetch('/api/slots')
        ]);

        setPlaces(placesData);
        setFloors(floorsData);
        setCategories(categoriesData);
        setSlots(slotsData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Failed to load required data');
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ParkingEntryFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/parking/sessions/check-in', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          in_time: new Date().toISOString(),
        }),
      });

      const selectedSlot = slots.find(s => s.id === data.slot_id);
      toast.success('Parking entry successful', {
        description: `Vehicle ${data.vehicle_no} has been parked in slot ${selectedSlot?.name}.`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/get-current');
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast.error(error.message || 'Failed to complete parking entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/home')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">New Parking Entry</h2>
            <p className="text-text-3">Register a vehicle entry into the parking system</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Available Slot</label>
                  <div className="relative">
                    <Grid className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <select 
                      {...register('slot_id')}
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all appearance-none",
                        errors.slot_id ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    >
                      <option value="">Select Slot</option>
                      {slots.filter(s => !s.is_occupied && (!selectedFloor || s.floor_id === selectedFloor)).map(slot => (
                        <option key={slot.id} value={slot.id}>{slot.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.slot_id && <p className="text-xs text-red font-medium">{errors.slot_id.message}</p>}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Vehicle Number</label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('vehicle_no')}
                      type="text"
                      placeholder="ABC-1234"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all uppercase",
                        errors.vehicle_no ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.vehicle_no && <p className="text-xs text-red font-medium">{errors.vehicle_no.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Driver Name (Optional)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('driver_name')}
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-bg-base border border-border rounded-xl text-text-1 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Driver Mobile (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('driver_mobile')}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 bg-bg-base border border-border rounded-xl text-text-1 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Entry Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      type="text"
                      value={new Date().toLocaleString()}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 bg-bg-surface border border-border rounded-xl text-text-3 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-bg-surface border-t border-border flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/home')}
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
                    <Plus size={20} />
                    Confirm Entry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
            <h4 className="font-display font-bold text-text-1 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-primary" />
              Entry Guidelines
            </h4>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Ensure the vehicle number is entered correctly for billing.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                The system will automatically assign the entry time.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                A printed ticket will be generated after confirmation.
              </li>
            </ul>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h4 className="font-display font-bold text-text-1 mb-4">Slot Status</h4>
            <div className="grid grid-cols-4 gap-2">
              {slots.slice(0, 12).map((slot, i) => (
                <div 
                  key={slot.id}
                  className={cn(
                    "aspect-square rounded-lg border flex items-center justify-center text-[10px] font-bold",
                    slot.is_occupied ? "bg-red/10 border-red/20 text-red" : "bg-green/10 border-green/20 text-green"
                  )}
                >
                  {slot.name}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-text-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green" />
                Available
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red" />
                Occupied
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
