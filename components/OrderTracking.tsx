
import React from 'react';
import { Order } from '../types';

interface OrderTrackingProps {
  status: Order['status'];
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ status }) => {
  if (status === 'rejected') {
    return (
      <div className="w-full py-4 px-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 animate-fadeIn">
        <i className="fa-solid fa-circle-xmark text-red-500 text-xl"></i>
        <div>
          <p className="text-[10px] font-black text-red-800 uppercase tracking-widest">Pedido Cancelado</p>
          <p className="text-[9px] text-red-600 font-medium leading-tight">Esta solicitação foi recusada pelo estabelecimento.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Pendente', icon: 'fa-clock' },
    { key: 'preparing', label: 'Cozinha', icon: 'fa-fire-burner' },
    { key: 'ready', label: 'Pronto', icon: 'fa-box' },
    { key: 'delivering', label: 'Rota', icon: 'fa-motorcycle' },
    { key: 'completed', label: 'Entregue', icon: 'fa-circle-check' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.key === status);
  };

  const index = getCurrentStepIndex();

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-red-500 -translate-y-1/2 z-0 transition-all duration-1000"
          style={{ width: `${(index / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, i) => (
          <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
              i <= index ? 'bg-white border-red-500 text-red-500 scale-110' : 'bg-white border-gray-100 text-gray-300'
            }`}>
              <i className={`fa-solid ${step.icon} text-[10px] ${i === index ? 'animate-pulse' : ''}`}></i>
            </div>
            <span className={`text-[7px] font-black uppercase tracking-tighter ${i <= index ? 'text-red-600' : 'text-gray-300'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
