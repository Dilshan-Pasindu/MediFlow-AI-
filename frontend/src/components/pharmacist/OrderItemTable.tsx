import React, { useState } from 'react';
import { OrderItem } from '../../types/order';
import { formatCurrency } from '../../utils/orderCalculations';
import { Trash2, Loader, Plus, Minus } from 'lucide-react';

interface OrderItemTableProps {
  items: OrderItem[];
  editable?: boolean;
  onUpdateQuantity?: (item: OrderItem, newQuantity: number) => void;
  onRemoveItem?: (item: OrderItem) => void;
  loadingItemId?: number | string | null;
  inventoryItems?: Array<{ medicineId: number; currentStock: number; medicineName: string }>;
}

export const OrderItemTable: React.FC<OrderItemTableProps> = ({
  items,
  editable = false,
  onUpdateQuantity,
  onRemoveItem,
  loadingItemId,
  inventoryItems,
}) => {
  const [editingQty, setEditingQty] = useState<Record<number, number>>({});

  if (!items || items.length === 0) return null;

  const handleQtyInputChange = (itemIdKey: number, value: number) => {
    setEditingQty(prev => ({ ...prev, [itemIdKey]: value }));
  };

  const handleApplyQty = (item: OrderItem, itemIdKey: number) => {
    const newQty = editingQty[itemIdKey] !== undefined ? editingQty[itemIdKey] : item.quantity;
    if (newQty > 0 && newQty !== item.quantity && onUpdateQuantity) {
      onUpdateQuantity(item, newQty);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200/80 shadow-2xs bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-normal text-[10px]">
            <th className="py-2.5 px-3">Medicine Item</th>
            <th className="py-2.5 px-3 text-right">Unit Price</th>
            <th className="py-2.5 px-3 text-center">Quantity</th>
            <th className="py-2.5 px-3 text-right">Subtotal</th>
            {editable && <th className="py-2.5 px-3 text-center w-16">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {items.map((item, idx) => {
            const itemKey = item.id ?? item.medicineId;
            const isLoading = loadingItemId === itemKey;
            const currentInputQty = editingQty[itemKey] !== undefined ? editingQty[itemKey] : item.quantity;
            const inv = inventoryItems?.find(i => i.medicineId === item.medicineId);
            const isInsufficientStock = inv !== undefined && currentInputQty > inv.currentStock;

            return (
              <tr key={idx} className={`text-slate-700 transition-colors ${isInsufficientStock ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-slate-50/70'}`}>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isInsufficientStock ? 'bg-red-500' : 'bg-teal-500'}`}></div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{item.medicineName}</div>
                      {item.genericName && <div className="text-[10px] text-slate-400 font-normal">{item.genericName}</div>}
                      {isInsufficientStock && (
                        <div className="text-[10px] font-bold text-red-600 bg-red-100/80 border border-red-200 px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-0.5">
                          <Trash2 size={9} className="hidden" /> Insufficient Stock ({inv.currentStock} available)
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-slate-600 text-[11px]">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2.5 px-3 text-center">
                  {editable && onUpdateQuantity ? (
                    <div className={`inline-flex items-center justify-center gap-0.5 border rounded-md p-0.5 shadow-2xs ${isInsufficientStock ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
                      <button
                        type="button"
                        className="w-5 h-5 rounded flex items-center justify-center bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/60 disabled:opacity-40 transition-colors shadow-2xs active:scale-95"
                        onClick={() => {
                          const next = Math.max(1, currentInputQty - 1);
                          handleQtyInputChange(itemKey, next);
                          if (next !== item.quantity) onUpdateQuantity(item, next);
                        }}
                        disabled={isLoading || currentInputQty <= 1}
                        title="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        className={`w-9 text-center border rounded px-1 py-0.5 text-xs font-bold focus:outline-none focus:ring-1 ${isInsufficientStock ? 'bg-red-100 border-red-300 text-red-900 focus:ring-red-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-teal-500'}`}
                        value={currentInputQty}
                        onChange={(e) => handleQtyInputChange(itemKey, Math.max(1, parseInt(e.target.value) || 1))}
                        onBlur={() => handleApplyQty(item, itemKey)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyQty(item, itemKey);
                        }}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="w-5 h-5 rounded flex items-center justify-center bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/60 disabled:opacity-40 transition-colors shadow-2xs active:scale-95"
                        onClick={() => {
                          const next = currentInputQty + 1;
                          handleQtyInputChange(itemKey, next);
                          onUpdateQuantity(item, next);
                        }}
                        disabled={isLoading}
                        title="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  ) : (
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${isInsufficientStock ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-800'}`}>{item.quantity}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-teal-700 text-xs">
                  {formatCurrency(item.subtotal || item.unitPrice * item.quantity)}
                </td>
                {editable && (
                  <td className="py-2.5 px-3 text-center">
                    {isLoading ? (
                      <Loader size={13} className="animate-spin inline text-teal-600" />
                    ) : (
                      onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-200 active:scale-95"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      )
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

