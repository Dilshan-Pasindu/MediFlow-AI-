import { useState, useEffect } from 'react';
import {
  CheckCircle,
  CheckCircle2,
  Loader,
  RefreshCw,
  AlertCircle,
  Pill,
  ShoppingCart,
  Calculator,
  Trash2,
  Plus,
  FileText,
  CreditCard,
  Download,
  ChevronDown,
  ChevronUp,
  Send,
  Package,
  FlaskConical,
  PartyPopper,
  Lock,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import {
  apiUpdateOrderStatus,
  apiCreateOrder,
  apiCalculateOrderPrice,
  apiDeleteOrder,
  apiAddOrderItem,
  apiUpdateOrderItem,
  apiRemoveOrderItem,
  apiGenerateBill,
  apiRecordPayment,
  apiGetInvoice,
  apiGetPharmacyInventory,
  apiNotifyOwnerRestock,
} from '../../services/api';
import { OrderHeaderCard } from '../../components/pharmacist/OrderHeaderCard';
import { OrderItemTable } from '../../components/pharmacist/OrderItemTable';
import { OrderPriceSummary } from '../../components/pharmacist/OrderPriceSummary';
import { OrderStatusBadge } from '../../components/pharmacist/OrderStatusBadge';
import { downloadInvoicePDF } from '../../utils/pdfGenerator';
import { formatCurrency } from '../../utils/orderCalculations';

import { usePharmacistPrescriptions, usePharmacistOrders, useMyPharmacy } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import type { Prescription } from '../../types/prescription';
import type { Order, OrderItem, Invoice } from '../../types/order';

const ORDER_STATUS_FLOW = ['Confirmed', 'Preparing', 'Ready', 'Dispensed'];
const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Pending:   { color: '#B45309', bg: '#FFFBEB' },
  Confirmed: { color: '#0369A1', bg: '#EFF6FF' },
  Preparing: { color: '#7C3AED', bg: '#EEF2FF' },
  Ready:     { color: '#059669', bg: '#ECFDF5' },
  Dispensed: { color: '#6366F1', bg: '#EEF2FF' },
};

export default function PharmacistDashboard() {
  const queryClient = useQueryClient();
  const { data: prescriptions = [], isLoading: rxLoading } = usePharmacistPrescriptions();
  const { data: orders = [], isLoading: ordLoading } = usePharmacistOrders();
  const { data: myPharmacy } = useMyPharmacy();
  const loading = rxLoading || ordLoading;

  const [actionLoading, setActionLoading] = useState<Record<string | number, string | null>>({});
  const [activeTab, setActiveTab] = useState('orders');
  const [messages, setMessages] = useState<Record<string | number, { type: string; text: string } | null>>({});

  // Inline Dispensing & Billing States
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});
  const [invoices, setInvoices] = useState<Record<number, Invoice | null>>({});
  const [selectedMedicineId, setSelectedMedicineId] = useState<Record<number, number>>({});
  const [selectedQty, setSelectedQty] = useState<Record<number, number>>({});
  const [itemErrors, setItemErrors] = useState<Record<number, string | null>>({});
  const [loadingItemId, setLoadingItemId] = useState<Record<number, number | string | null>>({});
  const [paymentMethods, setPaymentMethods] = useState<Record<number, string>>({});
  const [inventoryItems, setInventoryItems] = useState<
    Array<{
      medicineId: number;
      medicineName: string;
      genericName?: string;
      currentStock: number;
      unitPrice: number;
    }>
  >([]);

  const pharmacyId = myPharmacy?.id;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pharmacist'] });
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
    queryClient.invalidateQueries({ queryKey: ['owner'] });
  };

  // Fetch Live Pharmacy Inventory
  const fetchInventory = async () => {
    if (!pharmacyId) return;
    try {
      const res: any = await apiGetPharmacyInventory(pharmacyId, { pageSize: 200 });
      if (res?.items) {
        setInventoryItems(
          res.items.map((i: any) => ({
            medicineId: i.medicineId,
            medicineName: i.medicineName,
            genericName: i.genericName,
            currentStock: i.currentStock,
            unitPrice: i.unitPrice,
          }))
        );
      }
    } catch {
      // Keep existing inventory if fetch fails
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [pharmacyId]);

  // Fetch Invoice for an order
  const fetchInvoice = async (orderId: number) => {
    try {
      const inv = await apiGetInvoice(orderId);
      setInvoices(prev => ({ ...prev, [orderId]: inv }));
    } catch {
      setInvoices(prev => ({ ...prev, [orderId]: null }));
    }
  };

  // Toggle inline dispensing section
  const handleToggleExpand = (orderId: number) => {
    setExpandedOrders(prev => {
      const nextVal = !prev[orderId];
      if (nextVal) {
        fetchInvoice(orderId);
        fetchInventory();
      }
      return { ...prev, [orderId]: nextVal };
    });
  };

  // Add Item to Order
  const handleAddOrderItem = async (orderId: number) => {
    const medicineId = selectedMedicineId[orderId];
    const quantity = selectedQty[orderId] || 1;
    if (!medicineId) {
      setItemErrors(prev => ({ ...prev, [orderId]: 'Please select a medicine from inventory.' }));
      return;
    }

    const inv = inventoryItems.find(i => i.medicineId === medicineId);
    if (inv && quantity > inv.currentStock) {
      setItemErrors(prev => ({
        ...prev,
        [orderId]: `Not enough stock available for ${inv.medicineName} (Requested: ${quantity}, Available stock: ${inv.currentStock}).`,
      }));
      return;
    }

    setActionLoading(prev => ({ ...prev, [`add-item-${orderId}`]: 'adding' }));
    setItemErrors(prev => ({ ...prev, [orderId]: null }));
    try {
      await apiAddOrderItem(orderId, { medicineId, quantity });
      invalidate();
      fetchInventory();
      if (invoices[orderId]) fetchInvoice(orderId);
      setSelectedQty(prev => ({ ...prev, [orderId]: 1 }));
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item.';
      setItemErrors(prev => ({ ...prev, [orderId]: msg }));
    } finally {
      setActionLoading(prev => ({ ...prev, [`add-item-${orderId}`]: null }));
    }
  };

  // Update Order Item Quantity
  const handleUpdateOrderItem = async (orderId: number, item: OrderItem, newQuantity: number) => {
    const itemIdKey = item.id ?? item.medicineId;
    const itemMedId = item.medicineId;
    if (itemMedId) {
      const inv = inventoryItems.find(i => i.medicineId === itemMedId);
      if (inv && newQuantity > inv.currentStock) {
        setItemErrors(prev => ({
          ...prev,
          [orderId]: `Not enough stock available for ${item.medicineName} (Requested: ${newQuantity}, Available stock: ${inv.currentStock}).`,
        }));
        return;
      }
    }

    setLoadingItemId(prev => ({ ...prev, [orderId]: itemIdKey }));
    setItemErrors(prev => ({ ...prev, [orderId]: null }));
    try {
      await apiUpdateOrderItem(orderId, itemIdKey, { quantity: newQuantity });
      invalidate();
      fetchInventory();
      if (invoices[orderId]) fetchInvoice(orderId);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update item quantity.';
      setItemErrors(prev => ({ ...prev, [orderId]: msg }));
    } finally {
      setLoadingItemId(prev => ({ ...prev, [orderId]: null }));
    }
  };

  // Remove Item from Order
  const handleRemoveOrderItem = async (orderId: number, item: OrderItem) => {
    const itemIdKey = item.id ?? item.medicineId;
    setLoadingItemId(prev => ({ ...prev, [orderId]: itemIdKey }));
    setItemErrors(prev => ({ ...prev, [orderId]: null }));
    try {
      await apiRemoveOrderItem(orderId, itemIdKey);
      invalidate();
      fetchInventory();
      if (invoices[orderId]) fetchInvoice(orderId);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove item.';
      setItemErrors(prev => ({ ...prev, [orderId]: msg }));
    } finally {
      setLoadingItemId(prev => ({ ...prev, [orderId]: null }));
    }
  };

  // Generate Bill
  const handleGenerateBill = async (orderId: number) => {
    const order = orders.find((o: Order) => o.id === orderId);
    if (order && order.items) {
      for (const item of order.items) {
        if (item.medicineId) {
          const inv = inventoryItems.find(i => i.medicineId === item.medicineId);
          if (inv && item.quantity > inv.currentStock) {
            const stockErrMsg = `Not enough stock available for ${item.medicineName} (Requested: ${item.quantity}, Available stock: ${inv.currentStock}).`;
            setMessages(prev => ({
              ...prev,
              [orderId]: { type: 'error', text: stockErrMsg },
            }));
            setItemErrors(prev => ({
              ...prev,
              [orderId]: stockErrMsg,
            }));
            return;
          }
        }
      }
    }

    setActionLoading(prev => ({ ...prev, [`bill-${orderId}`]: 'generating' }));
    setMessages(prev => ({ ...prev, [orderId]: null }));
    setItemErrors(prev => ({ ...prev, [orderId]: null }));
    try {
      const invoice = await apiGenerateBill(orderId);
      setInvoices(prev => ({ ...prev, [orderId]: invoice }));
      setMessages(prev => ({
        ...prev,
        [orderId]: { type: 'success', text: `Invoice ${invoice.invoiceNumber} generated successfully!` },
      }));
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate bill.';
      setMessages(prev => ({ ...prev, [orderId]: { type: 'error', text: msg } }));
      setItemErrors(prev => ({ ...prev, [orderId]: msg }));
    } finally {
      setActionLoading(prev => ({ ...prev, [`bill-${orderId}`]: null }));
    }
  };

  // Record Payment
  const handleRecordPayment = async (orderId: number) => {
    const paymentMethod = paymentMethods[orderId] || 'Cash';
    setActionLoading(prev => ({ ...prev, [`pay-${orderId}`]: 'recording' }));
    setMessages(prev => ({ ...prev, [orderId]: null }));
    try {
      const updatedInvoice = await apiRecordPayment(orderId, { paymentMethod });
      setInvoices(prev => ({ ...prev, [orderId]: updatedInvoice }));
      setMessages(prev => ({
        ...prev,
        [orderId]: { type: 'success', text: `Payment recorded via ${paymentMethod}!` },
      }));
      invalidate();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to record payment.';
      setMessages(prev => ({ ...prev, [orderId]: { type: 'error', text: msg } }));
    } finally {
      setActionLoading(prev => ({ ...prev, [`pay-${orderId}`]: null }));
    }
  };

  const handleNotifyOwnerRestock = async (orderId: number) => {
    setActionLoading(prev => ({ ...prev, [`restock-${orderId}`]: 'notifying' }));
    try {
      const res = await apiNotifyOwnerRestock(orderId);
      setMessages(prev => ({
        ...prev,
        [orderId]: { type: 'success', text: res.message || 'Restock alert sent to Pharmacy Owner successfully!' },
      }));
      setItemErrors(prev => ({ ...prev, [orderId]: null }));
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to send restock notification.';
      setMessages(prev => ({ ...prev, [orderId]: { type: 'error', text: msg } }));
    } finally {
      setActionLoading(prev => ({ ...prev, [`restock-${orderId}`]: null }));
    }
  };

  // ─── Status advancement ──────────────────────────────────────────────────

  async function handleStatusUpdate(orderId: number | string, newStatus: string) {
    const orderNum = Number(orderId);
    const inv = invoices[orderNum];
    const targetOrder = orders.find((o: Order) => o.id === orderNum);

    if (newStatus === 'Dispensed') {
      const isPaid = inv?.isPaid || targetOrder?.isPaid;
      if (!isPaid) {
        setMessages(m => ({
          ...m,
          [orderId]: { type: 'error', text: 'Record payment before dispensing' },
        }));
        return;
      }
    }

    setActionLoading(a => ({ ...a, [orderId]: newStatus }));
    setMessages(m => ({ ...m, [orderId]: null }));

    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: `Order status updated to ${newStatus}` } }));

      if (newStatus === 'Dispensed') {
        setExpandedOrders(prev => ({ ...prev, [orderNum]: false }));
      }
      invalidate();
      fetchInventory();
    } catch (err: any) {
      let msg = 'Update failed';
      const errText = err.response?.data?.message || err.message || '';
      if (errText.toLowerCase().includes('unpaid') || errText.toLowerCase().includes('invoice')) {
        msg = 'Cannot dispense order: Invoice is not paid. Please record payment first.';
      } else if (
        errText.toLowerCase().includes('stock') ||
        errText.toLowerCase().includes('inventory') ||
        errText.toLowerCase().includes('insufficient')
      ) {
        msg = 'Cannot dispense order: Insufficient stock in inventory.';
      } else if (
        errText.toLowerCase().includes('safety') ||
        errText.toLowerCase().includes('interaction') ||
        errText.toLowerCase().includes('warning')
      ) {
        msg = 'Cannot dispense order: High-severity drug interaction safety warning must be acknowledged.';
      } else if (errText) {
        msg = errText;
      }
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: msg } }));
    } finally {
      setActionLoading(a => ({ ...a, [orderId]: null }));
    }
  }

  // ─── Delete order ─────────────────────────────────────────────────────────

  async function handleDeleteOrder(orderId: number | string) {
    if (!window.confirm(`Are you sure you want to delete / cancel Order #${orderId}?`)) return;
    setActionLoading(a => ({ ...a, [`del-${orderId}`]: 'deleting' }));
    try {
      await apiDeleteOrder(orderId);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: `Order #${orderId} deleted successfully.` } }));
      invalidate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete order failed';
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: msg } }));
    } finally {
      setActionLoading(a => ({ ...a, [`del-${orderId}`]: null }));
    }
  }

  // ─── Convert prescription → order ───────────────────────────────────────

  async function handleConvertToOrder(rx: Prescription) {
    if (!pharmacyId) {
      setMessages(m => ({ ...m, [`rx-${rx.id}`]: { type: 'error', text: 'Pharmacy not found. Please refresh.' } }));
      return;
    }
    setActionLoading(a => ({ ...a, [`rx-${rx.id}`]: 'converting' }));
    try {
      await apiCreateOrder({ prescriptionId: Number(rx.id), pharmacyId, items: [] });
      setMessages(m => ({ ...m, [`rx-${rx.id}`]: { type: 'success', text: 'Order created successfully!' } }));
      queryClient.invalidateQueries({ queryKey: ['pharmacist', 'prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacist', 'orders'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      setMessages(m => ({ ...m, [`rx-${rx.id}`]: { type: 'error', text: msg } }));
    } finally {
      setActionLoading(a => ({ ...a, [`rx-${rx.id}`]: null }));
    }
  }

  // ─── Calculate price ─────────────────────────────────────────────────────

  async function handleCalculatePrice(orderId: number | string) {
    if (!pharmacyId) return;
    setActionLoading(a => ({ ...a, [`calc-${orderId}`]: 'calculating' }));
    try {
      await apiCalculateOrderPrice(orderId, pharmacyId);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: 'Prices updated from inventory.' } }));
      invalidate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Price calculation failed';
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: msg } }));
    } finally {
      setActionLoading(a => ({ ...a, [`calc-${orderId}`]: null }));
    }
  }

  const activeOrders = orders.filter((o: Order) => !['Dispensed', 'Cancelled'].includes(o.status));
  const completedOrders = orders.filter((o: Order) => o.status === 'Dispensed');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Pharmacist Dashboard"
          subtitle="Manage prescriptions and process medicine orders"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={invalidate} id="refresh-pharma-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="pharma"
            title="Pharmacist Portal"
            subtitle="Process prescriptions and manage medicine dispensing"
            loading={loading}
            stats={[
              { label: 'New Prescriptions', value: prescriptions.filter((p: Prescription) => p.status === 'Active').length, icon: <FileText size={16} /> },
              { label: 'Active Orders', value: activeOrders.length, icon: <FlaskConical size={16} />, highlight: activeOrders.length > 0 },
              { label: 'Dispensed Today', value: completedOrders.length, icon: <CheckCircle2 size={16} /> },
            ]}
          />

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              id="tab-orders-pharma"
            >
              <FlaskConical size={14} className="inline mr-1.5" /> Active Orders ({activeOrders.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('prescriptions')}
              id="tab-rx-pharma"
            >
              <FileText size={14} className="inline mr-1.5" /> Prescriptions ({prescriptions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
              id="tab-completed-pharma"
            >
              <CheckCircle2 size={14} className="inline mr-1.5" /> Dispensed ({completedOrders.length})
            </button>
          </div>

          {/* ── Active Orders Tab ──────────────────────────────────────────── */}
          {activeTab === 'orders' &&
            (loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--r-lg)' }} />
                ))}
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon flex items-center justify-center text-teal-600">
                  <PartyPopper size={36} />
                </div>
                <div className="empty-title">No active orders!</div>
                <div className="empty-sub">All orders have been processed.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeOrders.map((order: Order) => {
                  const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                  const nextStatusIdx = ORDER_STATUS_FLOW.indexOf(order.status) + 1;
                  const nextStatus = ORDER_STATUS_FLOW[nextStatusIdx] as string | undefined;
                  const isAdvancing = actionLoading[order.id];
                  const isCalcing = actionLoading[`calc-${order.id}`];
                  const msg = messages[order.id];
                  const isExpanded = !!expandedOrders[order.id];
                  const invoice = invoices[order.id];
                  const isPaid = invoice?.isPaid || order.isPaid || order.paymentStatus === 'Paid' || invoice?.paymentStatus === 'Paid';
                  const isEditable = order.status !== 'Dispensed' && !isPaid;
                  const isAddingItem = actionLoading[`add-item-${order.id}`];
                  const isGeneratingBill = actionLoading[`bill-${order.id}`];
                  const isRecordingPayment = actionLoading[`pay-${order.id}`];

                  return (
                    <div key={order.id} className="card shadow-sm border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all" id={`pharma-order-${order.id}`}>
                      {/* Clean Single-Row Card Header */}
                      <div className="card-header bg-slate-50/60 border-b border-slate-200/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                        <OrderHeaderCard
                          orderId={order.id}
                          patientName={order.patientName}
                          createdAt={order.createdAt}
                        />

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <OrderStatusBadge status={order.status} />

                          {/* Calculate Price */}
                          {isEditable && (
                            <button
                              className="btn btn-ghost btn-sm text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-white rounded-lg transition-all"
                              onClick={() => handleCalculatePrice(order.id)}
                              disabled={!!isCalcing}
                              id={`calc-price-order-${order.id}`}
                              title="Recalculate prices from inventory"
                            >
                              {isCalcing ? <Loader size={12} className="spin text-teal-600" /> : <Calculator size={12} className="text-teal-600" />}
                              Price
                            </button>
                          )}

                          {/* Delete / Cancel Order */}
                          {!isPaid && (
                            <button
                              className="btn btn-ghost btn-sm text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={!!actionLoading[`del-${order.id}`]}
                              id={`delete-order-${order.id}`}
                              title="Cancel / Delete Order"
                            >
                              {actionLoading[`del-${order.id}`] ? <Loader size={12} className="spin" /> : <Trash2 size={12} />}
                              Delete
                            </button>
                          )}

                          {/* Start to Dispense Button */}
                          {order.status !== 'Dispensed' && (
                            <button
                              className={`btn btn-sm text-xs font-bold rounded-lg transition-all border ${
                                isExpanded
                                  ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                  : 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100 shadow-2xs'
                              }`}
                              onClick={() => handleToggleExpand(order.id)}
                              id={`toggle-dispense-order-${order.id}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                            >
                              <Pill size={13} className={isExpanded ? 'text-slate-600' : 'text-teal-700'} />
                              {isExpanded ? 'Hide Dispense Panel' : 'Start to Dispense'}
                              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          )}

                          {/* Advance Status */}
                          {nextStatus && (
                            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <button
                                className="btn btn-primary btn-sm text-xs font-bold shadow-xs hover:shadow-sm rounded-lg transition-all"
                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                disabled={!!isAdvancing || (nextStatus === 'Dispensed' && !isPaid)}
                                id={`advance-order-${order.id}`}
                              >
                                {isAdvancing ? <Loader size={12} className="spin" /> : <CheckCircle size={12} />}
                                Mark as {nextStatus}
                              </button>
                              {nextStatus === 'Dispensed' && !isPaid && (
                                <span className="text-[10px] text-amber-600 font-semibold mt-0.5">
                                  Record payment before dispensing
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card-body p-5 space-y-4">
                        {msg && (
                          <div
                            style={{
                              padding: '10px 14px',
                              borderRadius: 'var(--r-md)',
                              background: msg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                              color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                              fontSize: 12.5,
                              fontWeight: 600,
                              display: 'flex',
                              gap: 6,
                              alignItems: 'center',
                            }}
                          >
                            {msg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {msg.text}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {(order.items || []).map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-50/90 text-teal-800 border border-teal-200/80 text-[11px] font-medium shadow-2xs shrink-0">
                                <Pill size={10} className="text-teal-600 shrink-0" /> {item.medicineName} <span className="text-teal-700 font-bold">×{item.quantity}</span>
                              </span>
                            ))}
                          </div>

                          <OrderPriceSummary totalAmount={order.totalAmount} isPaid={isPaid} />
                        </div>

                        {/* ─── INLINE DISPENSING & BILLING PANEL ─────────────────── */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-200/70 bg-gradient-to-b from-slate-50/80 via-teal-50/20 to-emerald-50/10 rounded-xl p-4 shadow-2xs transition-all space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Pill size={14} className="text-teal-600 shrink-0" />
                                Dispensing & Billing Editor
                              </h4>
                              <span className={`text-[10px] border px-2.5 py-0.5 rounded-full font-medium shrink-0 inline-flex items-center gap-1 ${isEditable ? 'text-teal-800 bg-teal-100/70 border-teal-200/80' : 'text-slate-700 bg-slate-100 border-slate-300 font-semibold'}`}>
                                {isEditable ? 'Interactive Editor Mode' : (
                                  <>
                                    <Lock size={10} className="shrink-0" />
                                    <span>Finalized & Locked (Paid)</span>
                                  </>
                                )}
                              </span>
                            </div>

                            {/* Stock Error Banner */}
                            {itemErrors[order.id] && (
                              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-center justify-between gap-2 shadow-2xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
                                  <span className="truncate">{itemErrors[order.id]}</span>
                                </div>
                                {itemErrors[order.id]?.toLowerCase().includes('stock') && (
                                  <button
                                    type="button"
                                    className="btn btn-sm text-[11px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md px-2.5 py-1 flex items-center gap-1 shadow-2xs transition-all shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
                                    onClick={() => handleNotifyOwnerRestock(order.id)}
                                    disabled={!!actionLoading[`restock-${order.id}`]}
                                  >
                                    {actionLoading[`restock-${order.id}`] ? (
                                      <Loader size={12} className="spin text-amber-800 animate-spin" />
                                    ) : (
                                      <Send size={12} className="text-amber-800" />
                                    )}
                                    <span>Request Restock from Owner</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {/* 1. Add Medicine from Pharmacy Inventory */}
                            {isEditable && (
                              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-2xs space-y-2">
                                <label className="block text-[11px] font-semibold text-slate-700">
                                  Add Medicine from Pharmacy Inventory
                                </label>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <select
                                    className="flex-1 min-w-[200px] text-xs bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-normal focus:ring-1 focus:ring-teal-500 hover:bg-white transition-all outline-none"
                                    value={selectedMedicineId[order.id] || ''}
                                    onChange={e =>
                                      setSelectedMedicineId(prev => ({
                                        ...prev,
                                        [order.id]: parseInt(e.target.value) || 0,
                                      }))
                                    }
                                  >
                                    <option value="">-- Select Medicine (Available Stock) --</option>
                                    {inventoryItems.map(inv => (
                                      <option key={inv.medicineId} value={inv.medicineId}>
                                        {inv.medicineName} {inv.genericName ? `(${inv.genericName})` : ''} — Stock: {inv.currentStock} | {formatCurrency(inv.unitPrice)}
                                      </option>
                                    ))}
                                  </select>

                                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                                    <span className="text-[11px] font-semibold text-slate-500">Qty:</span>
                                    <input
                                      type="number"
                                      min={1}
                                      className="w-12 text-xs font-bold border border-slate-200 rounded px-1.5 py-0.5 text-center text-slate-900 focus:ring-1 focus:ring-teal-500 outline-none"
                                      value={selectedQty[order.id] ?? 1}
                                      onChange={e =>
                                        setSelectedQty(prev => ({
                                          ...prev,
                                          [order.id]: Math.max(1, parseInt(e.target.value) || 1),
                                        }))
                                      }
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm flex items-center gap-1 font-semibold text-xs shadow-2xs px-3 py-1 rounded-lg transition-all shrink-0 overflow-hidden"
                                    onClick={() => handleAddOrderItem(order.id)}
                                    disabled={!!isAddingItem || !selectedMedicineId[order.id]}
                                  >
                                    {isAddingItem ? <Loader size={12} className="spin" /> : <Plus size={12} />}
                                    Add Item
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 2. Order Line Items Table */}
                            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-2xs space-y-2">
                              <h5 className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                                <Pill size={13} className="text-teal-600 shrink-0" />
                                Order Line Items
                              </h5>
                              <OrderItemTable
                                items={order.items || []}
                                editable={isEditable}
                                onUpdateQuantity={(item, qty) => handleUpdateOrderItem(order.id, item, qty)}
                                onRemoveItem={item => handleRemoveOrderItem(order.id, item)}
                                loadingItemId={loadingItemId[order.id]}
                                inventoryItems={inventoryItems}
                              />
                            </div>

                            {/* 3. Invoice & Billing Section */}
                            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-2xs space-y-2.5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h5 className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                                  <FileText size={13} className="text-teal-600 shrink-0" />
                                  Invoice & Billing
                                </h5>

                                {!invoice ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm flex items-center gap-1 font-semibold text-xs shadow-2xs px-3 py-1 rounded-lg transition-all shrink-0 overflow-hidden"
                                    onClick={() => handleGenerateBill(order.id)}
                                    disabled={!!isGeneratingBill || (order.items || []).length === 0}
                                  >
                                    {isGeneratingBill ? <Loader size={12} className="spin" /> : <FileText size={12} />}
                                    Generate Bill
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm text-teal-700 hover:bg-teal-50 border border-teal-200/80 rounded-lg flex items-center gap-1 font-semibold text-xs transition-all shrink-0 overflow-hidden"
                                    onClick={() => downloadInvoicePDF(invoice, order)}
                                  >
                                    <Download size={12} />
                                    Download Bill (PDF)
                                  </button>
                                )}
                              </div>

                              {/* Itemized Invoice Display */}
                              {invoice ? (
                                <div className="space-y-2.5 pt-0.5">
                                  <div className="flex flex-wrap justify-between items-center bg-slate-50 p-2.5 rounded-lg text-[11px] border border-slate-200/60 gap-2">
                                    <div>
                                      <span className="font-semibold text-slate-600">Invoice #: </span>
                                      <span className="font-mono text-teal-700 font-bold">{invoice.invoiceNumber}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-slate-400">Issued: </span>
                                      <span className="font-semibold text-slate-700">{new Date(invoice.issuedAt).toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          invoice.isPaid
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                                        }`}
                                      >
                                        {invoice.isPaid ? 'PAID' : 'UNPAID'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Invoice Line Breakdown */}
                                  <div className="overflow-x-auto rounded-lg border border-slate-200/70">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 font-semibold uppercase tracking-normal text-[10px]">
                                          <th className="py-2 px-3">Medicine</th>
                                          <th className="py-2 px-3 text-center">Qty</th>
                                          <th className="py-2 px-3 text-right">Unit Price</th>
                                          <th className="py-2 px-3 text-right">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 bg-white">
                                        {(invoice.items || []).map((invItem, idx) => (
                                          <tr key={idx} className="text-slate-700 hover:bg-slate-50/50">
                                            <td className="py-2 px-3 font-medium text-slate-900 text-xs">{invItem.medicineName}</td>
                                            <td className="py-2 px-3 text-center font-bold text-slate-700 text-xs">{invItem.quantity}</td>
                                            <td className="py-2 px-3 text-right text-slate-500 text-[11px]">{formatCurrency(invItem.unitPrice)}</td>
                                            <td className="py-2 px-3 text-right font-bold text-teal-700 text-xs">{formatCurrency(invItem.subtotal)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="flex justify-between items-center p-2.5 bg-teal-50/40 rounded-lg font-bold text-xs text-slate-900 border border-teal-100/80">
                                    <span className="uppercase text-[10px] tracking-normal text-slate-500 font-semibold">Grand Total</span>
                                    <span className="text-teal-700 font-bold text-sm">{formatCurrency(invoice.totalAmount)}</span>
                                  </div>

                                  {/* 4. Payment Section (only shown once bill is generated) */}
                                  <div className="pt-2 border-t border-dashed border-slate-200">
                                    <h6 className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                                      <CreditCard size={13} className="text-teal-600 shrink-0" />
                                      Counter Payment
                                    </h6>

                                    {invoice.isPaid ? (
                                      <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs rounded-lg font-medium flex items-center justify-between shadow-2xs">
                                        <span className="flex items-center gap-1.5">
                                          <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                                          Payment Recorded Successfully
                                        </span>
                                        <span className="font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                          {invoice.paymentMethod || 'Paid'}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                                          <label className="text-[11px] font-semibold text-slate-500">Method:</label>
                                          <select
                                            className="text-xs font-medium bg-white border border-slate-200 rounded px-2 py-0.5 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800"
                                            value={paymentMethods[order.id] || 'Cash'}
                                            onChange={e =>
                                              setPaymentMethods(prev => ({
                                                ...prev,
                                                [order.id]: e.target.value,
                                              }))
                                            }
                                          >
                                            <option value="Cash">Cash</option>
                                            <option value="Card">Credit/Debit Card</option>
                                            <option value="Insurance">Insurance</option>
                                            <option value="Online">Online</option>
                                          </select>
                                        </div>

                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm flex items-center gap-1 font-semibold text-xs shadow-2xs px-3 py-1 rounded-lg transition-all shrink-0 overflow-hidden"
                                          onClick={() => handleRecordPayment(order.id)}
                                          disabled={!!isRecordingPayment}
                                        >
                                          {isRecordingPayment ? <Loader size={12} className="spin" /> : <CreditCard size={12} />}
                                          Record Payment
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  Click "Generate Bill" above to create an itemized invoice and enable counter payment recording.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* ── Prescriptions Tab ─────────────────────────────────────────── */}
          {activeTab === 'prescriptions' &&
            (loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--r-lg)' }} />
                ))}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon flex items-center justify-center text-teal-600">
                  <Pill size={36} />
                </div>
                <div className="empty-title">No pending prescriptions</div>
                <div className="empty-sub">All prescriptions have been processed into orders.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {prescriptions.map((rx: Prescription) => {
                  const rxKey = `rx-${rx.id}`;
                  const isConverting = actionLoading[rxKey];
                  const msg = messages[rxKey];
                  return (
                    <div key={rx.id} className="rx-card" id={`rx-pharma-${rx.id}`}>
                      <div className="rx-header">
                        <div className="rx-id">
                          Rx #{rx.id} — {rx.appointmentNumber ?? '—'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`badge ${rx.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>{rx.status}</span>
                          {!rx.safetyCheckedAt ? (
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded inline-flex items-center gap-1">
                              <AlertCircle size={12} /> Run AI Safety Check first
                            </span>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleConvertToOrder(rx)}
                              disabled={!!isConverting}
                              id={`convert-rx-${rx.id}`}
                              title="Create a medicine order from this prescription"
                            >
                              {isConverting ? <Loader size={12} className="spin" /> : <ShoppingCart size={12} />}
                              Convert to Order
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="rx-body">
                        {msg && (
                          <div
                            style={{
                              marginBottom: 10,
                              padding: '6px 10px',
                              borderRadius: 'var(--r-md)',
                              background: msg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                              color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                              fontSize: 12,
                              fontWeight: 600,
                              display: 'flex',
                              gap: 6,
                              alignItems: 'center',
                            }}
                          >
                            {msg.type === 'success' ? <CheckCircle size={11} /> : <AlertCircle size={11} />} {msg.text}
                          </div>
                        )}
                        <div className="info-row">
                          <span className="info-row-label">Patient:</span>
                          {rx.patientName}
                        </div>
                        <div className="info-row">
                          <span className="info-row-label">Doctor:</span>
                          {rx.doctorName}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                          {(rx.items || []).map((item, i) => (
                            <span key={i} className="badge badge-teal">
                              <Pill size={10} /> {item.medicineName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* ── Dispensed Tab ─────────────────────────────────────────────── */}
          {activeTab === 'completed' &&
            (completedOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={36} />
                </div>
                <div className="empty-title">No dispensed orders yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {completedOrders.map((order: Order) => (
                  <div key={order.id} className="card" id={`dispensed-order-${order.id}`}>
                    <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          Order #{order.id} — {order.patientName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          Dispensed · {formatCurrency(order.totalAmount)}
                        </div>
                      </div>
                      <OrderStatusBadge status="Dispensed" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
