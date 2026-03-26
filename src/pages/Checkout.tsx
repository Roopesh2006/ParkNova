import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Car, 
  MapPin, 
  Layers, 
  Grid, 
  Receipt, 
  CreditCard, 
  Banknote, 
  CheckCircle2,
  Printer,
  Download,
  Calendar,
  Timer
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { apiFetch } from '../lib/api-client';

interface ParkingEntry {
  id: string;
  vehicle_no: string;
  place_name: string;
  floor_name: string;
  category_name: string;
  slot_name: string;
  in_time: string;
  status: 'parking' | 'ended';
}

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'card' | 'upi'>('cash');
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsFetching(true);
        const data = await apiFetch(`/api/parking/sessions/${id}`);
        setSession(data);
      } catch (error: any) {
        console.error('Error fetching session:', error);
        toast.error(error.message || 'Failed to load session details');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchSession();
  }, [id]);

  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-3 font-medium">Loading session details...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center text-text-3 mb-4">
          <Car size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-1">Session not found</h3>
        <button 
          onClick={() => navigate('/parking/get-current')}
          className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl"
        >
          Back to Current Parking
        </button>
      </div>
    );
  }

  const outTime = new Date();
  const inTime = new Date(session.in_time);
  const durationMs = outTime.getTime() - inTime.getTime();
  const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
  
  // In a real app, we'd fetch the tariff based on category and place
  const hourlyRate = session.tariff?.hourly_rate || 50;
  const minAmount = session.tariff?.min_amount || 50;
  const totalAmount = Math.max(minAmount, durationHours * hourlyRate);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const paidAmount = totalAmount * 1.05; // Including tax
      await apiFetch(`/api/parking/sessions/${id}/check-out`, {
        method: 'POST',
        body: JSON.stringify({
          receive_amount: totalAmount * 1.05,
          paid_amount: paidAmount,
          return_amount: 0,
          checked_out_by: null,
          exit_floor_id: session.floor_id,
        }),
      });

      toast.success('Checkout successful', {
        description: `Vehicle ${session.vehicle_no} has exited. Total amount: $${paidAmount.toFixed(2)}`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/get-current');
    } catch (error: any) {
      console.error('Error checking out:', error);
      toast.error(error.message || 'Failed to complete checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/parking/get-current')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Vehicle Checkout</h2>
            <p className="text-text-3">Process exit and generate billing for vehicle {session.vehicle_no}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all">
            <Printer size={20} />
          </button>
          <button className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 border-b border-border bg-bg-surface/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Car size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-mono font-black text-text-1 tracking-widest uppercase">{session.vehicle_no}</h3>
                    <p className="text-text-3 font-medium">{session.category?.name} • {session.place?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3 mb-1">Status</div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    Currently Parking
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3">Floor</div>
                  <div className="flex items-center gap-2 text-text-1 font-bold">
                    <Layers size={16} className="text-primary" />
                    {session.floor?.name}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3">Slot</div>
                  <div className="flex items-center gap-2 text-text-1 font-bold">
                    <Grid size={16} className="text-primary" />
                    {session.slot?.name}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3">Entry Date</div>
                  <div className="flex items-center gap-2 text-text-1 font-bold">
                    <Calendar size={16} className="text-primary" />
                    {format(inTime, 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3">Entry Time</div>
                  <div className="flex items-center gap-2 text-text-1 font-bold">
                    <Clock size={16} className="text-primary" />
                    {format(inTime, 'HH:mm:ss')}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3">Duration</div>
                  <div className="flex items-center gap-2 text-2xl font-display font-black text-text-1">
                    <Timer size={24} className="text-primary" />
                    {Math.floor(durationMs / (1000 * 60 * 60))}h {Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))}m
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-text-3">Exit Time</div>
                  <div className="text-xl font-bold text-text-1">
                    {format(outTime, 'HH:mm:ss')}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-3">Payment Method</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                      paymentMethod === 'cash' 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-bg-base border-border text-text-3 hover:border-text-3"
                    )}
                  >
                    <Banknote size={24} />
                    <span className="text-sm font-bold">Cash</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                      paymentMethod === 'card' 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-bg-base border-border text-text-3 hover:border-text-3"
                    )}
                  >
                    <CreditCard size={24} />
                    <span className="text-sm font-bold">Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                      paymentMethod === 'upi' 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-bg-base border-border text-text-3 hover:border-text-3"
                    )}
                  >
                    <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-bg-card font-black text-[10px]">QR</div>
                    <span className="text-sm font-bold">UPI / QR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-bg-card border border-border rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <h3 className="text-xl font-display font-black text-text-1 flex items-center gap-2">
              <Receipt size={20} className="text-primary" />
              Billing Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Base Fare (Min Amount)</span>
                <span className="text-text-1 font-bold">${minAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Duration Charge ({durationHours}h)</span>
                <span className="text-text-1 font-bold">${(durationHours * hourlyRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Tax (GST 5%)</span>
                <span className="text-text-1 font-bold">${(totalAmount * 0.05).toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-border my-4" />
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-3">Total Amount</span>
                  <div className="text-4xl font-display font-black text-primary tracking-tight">
                    ${(totalAmount * 1.05).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Complete Checkout
                </>
              )}
            </button>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <Receipt size={16} />
              Tariff Info
            </h4>
            <p className="text-xs text-text-2 leading-relaxed">
              Current rate for <span className="text-primary font-bold">{session.category?.name}</span> at <span className="text-primary font-bold">{session.place?.name}</span> is <span className="text-primary font-bold">${hourlyRate}/hour</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
