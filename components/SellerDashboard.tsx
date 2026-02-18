
import React from 'react';
import { Order, Restaurant } from '../types';

interface SellerDashboardProps {
  orders: Order[];
  restaurants: Restaurant[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  onManageLojas: () => void;
  onBackToMain?: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ orders, restaurants, updateOrderStatus, onManageLojas, onBackToMain }) => {
  const currentRes = restaurants[0];

  const profitsByDate = orders.reduce((acc, order) => {
    if (order.status === 'rejected') return acc;
    const date = order.date;
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(profitsByDate)
    .map(([date, value]) => ({ date, value: value as number }))
    .slice(-7);

  const maxProfit = Math.max(...chartData.map(d => d.value as number), 10);
  const totalSalesAllTime = orders
    .filter(o => o.status !== 'rejected')
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Painel do Parceiro</h1>
          <p className="text-sm text-gray-500">Gestão financeira e operacional</p>
        </div>
        <div className="flex gap-2">
          {onBackToMain && (
            <button onClick={onBackToMain} className="hidden md:block bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-200 transition-all">
              <i className="fa-solid fa-house mr-2"></i>
              Home
            </button>
          )}
          <button 
            onClick={onManageLojas}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-500 hover:text-white transition-all"
          >
            Configurações da Loja
          </button>
        </div>
      </div>

      {currentRes && (
        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-red-500"></i>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Endereço da Operação</p>
          </div>
          <p className="text-sm font-bold">{currentRes.address || 'Endereço não informado'}</p>
        </div>
      )}

      <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-black text-lg text-gray-800">Lucros Diários</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Apenas pedidos concluídos ou em curso</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-black uppercase">Total Acumulado</p>
            <p className="text-xl font-black text-[#EA1D2C]">R$ {totalSalesAllTime.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="flex items-end justify-between h-48 gap-2 pt-8">
            {chartData.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="relative w-full flex flex-col items-center">
                  <div className="absolute -top-8 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    R$ {(day.value as number).toFixed(2)}
                  </div>
                  <div 
                    className="w-full max-w-[40px] bg-gray-100 rounded-t-xl group-hover:bg-red-500 transition-all duration-500 relative overflow-hidden"
                    style={{ height: `${((day.value as number) / maxProfit) * 100}%`, minHeight: '4px' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                  </div>
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase rotate-45 md:rotate-0 mt-2">
                  {day.date.split('/')[0]}/{day.date.split('/')[1]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-3xl text-gray-300">
            <i className="fa-solid fa-chart-line text-4xl mb-3 opacity-20"></i>
            <p className="text-sm font-bold">Aguardando primeiras vendas...</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3">
            <i className="fa-solid fa-money-bill-trend-up"></i>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendas Hoje</p>
          <p className="text-xl font-black text-green-600">
            R$ {(profitsByDate[new Date().toLocaleDateString('pt-BR')] || 0).toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
            <i className="fa-solid fa-shopping-bag"></i>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos Ativos</p>
          <p className="text-xl font-black text-blue-600">{orders.filter(o => !['completed', 'rejected'].includes(o.status)).length}</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-black text-lg text-gray-800">Últimos Pedidos</h2>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <i className="fa-solid fa-clock-rotate-left text-4xl text-gray-100 mb-3"></i>
              <p className="text-gray-400 font-medium">Nenhum pedido recebido ainda.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all flex flex-col gap-6 ${order.status === 'rejected' ? 'grayscale opacity-70' : 'hover:shadow-md'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm bg-gray-900 text-white px-2 py-1 rounded-lg">#{order.id}</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          order.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-600' : 
                          order.status === 'ready' ? 'bg-purple-100 text-purple-600' :
                          order.status === 'delivering' ? 'bg-blue-100 text-blue-600' : 
                          order.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {order.status === 'pending' ? 'Pendente' : 
                           order.status === 'preparing' ? 'Cozinhando' : 
                           order.status === 'ready' ? 'Pronto' :
                           order.status === 'delivering' ? 'Em Rota' : 
                           order.status === 'rejected' ? 'Rejeitado' : 'Concluído'}
                        </span>
                      </div>
                      <div className="text-right">
                         <span className="block text-[10px] text-gray-400 font-bold">{order.date}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-[10px]">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Dados do Cliente</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <p className="text-sm font-bold text-gray-800">{order.customerInfo.name}</p>
                        <p className="text-xs text-gray-500">{order.customerInfo.address}</p>
                        <p className="text-xs text-gray-500 font-bold">{order.customerInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-800 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Resumo do Itens</p>
                      {order.items.map(i => (
                        <div key={i.id} className="flex justify-between border-b border-gray-100 last:border-0 py-2">
                          <span className="font-bold text-xs">{i.quantity}x {i.name}</span>
                          <span className="text-gray-500 font-bold text-[10px]">R$ {(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-3 mt-1 border-t border-gray-200 font-black text-lg">
                        <span className="text-[10px] text-gray-400 uppercase">VALOR TOTAL</span>
                        <span className="text-[#EA1D2C]">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                        <i className={`fa-solid ${order.paymentMethod === 'pix' ? 'fa-brands fa-pix text-teal-500' : order.paymentMethod === 'card' ? 'fa-credit-card text-blue-500' : 'fa-money-bill-1-wave text-green-500'}`}></i>
                        {order.paymentMethod.toUpperCase()}
                      </div>
                      {order.paymentDetails && (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-tighter">
                          {order.paymentDetails}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 justify-center md:min-w-[180px]">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="bg-green-600 text-white p-4 rounded-2xl text-xs font-black shadow-lg hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                          <i className="fa-solid fa-check"></i> Aceitar Pedido
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Deseja realmente REJEITAR este pedido?')) {
                              updateOrderStatus(order.id, 'rejected');
                            }
                          }} 
                          className="bg-white text-gray-400 p-3 rounded-2xl text-[10px] font-black border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-xmark"></i> Rejeitar
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => updateOrderStatus(order.id, 'ready')} className="bg-purple-500 text-white p-4 rounded-2xl text-xs font-black shadow-lg hover:bg-purple-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <i className="fa-solid fa-box"></i> Pronto p/ Entrega
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button onClick={() => updateOrderStatus(order.id, 'delivering')} className="bg-blue-500 text-white p-4 rounded-2xl text-xs font-black shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <i className="fa-solid fa-motorcycle"></i> Saiu p/ Entrega
                      </button>
                    )}
                    {order.status === 'delivering' && (
                      <button onClick={() => updateOrderStatus(order.id, 'completed')} className="bg-green-500 text-white p-4 rounded-2xl text-xs font-black shadow-lg hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <i className="fa-solid fa-check"></i> Finalizar
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <div className="text-center py-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 font-black text-[10px] flex items-center justify-center gap-2">
                        <i className="fa-solid fa-circle-check"></i> CONCLUÍDO
                      </div>
                    )}
                    {order.status === 'rejected' && (
                      <div className="text-center py-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 font-black text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest">
                        <i className="fa-solid fa-ban"></i> Pedido Rejeitado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
