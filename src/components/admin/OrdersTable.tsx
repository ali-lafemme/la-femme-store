'use client';

import { useState } from 'react';
import { Order } from '@/lib/api';
import { createOrderNotification } from '@/lib/whatsapp';

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'معلق';
      case 'CONFIRMED':
        return 'مؤكد';
      case 'SHIPPED':
        return 'تم الشحن';
      case 'DELIVERED':
        return 'تم التوصيل';
      case 'CANCELLED':
        return 'ملغي';
      default:
        return status;
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editingOrder.status,
          notes: editingOrder.notes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('تم تحديث حالة الطلب بنجاح!');
        setEditingOrder(null);
        window.location.reload();
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWhatsApp = async (order: Order) => {
    try {
      setIsLoading(true);
      
      // إنشاء رسالة الواتساب
      const message = createOrderNotification({
        ...order,
        notes: order.notes || undefined
      });
      
      // إنشاء رابط الواتساب
      const whatsappUrl = `https://wa.me/381615851106?text=${encodeURIComponent(message)}`;
      
      // فتح الواتساب في نافذة جديدة
      window.open(whatsappUrl, '_blank');
      
      alert('تم فتح الواتساب! يرجى إرسال الرسالة يدوياً.\n\nلإرسال أوتوماتيكي، تحتاج إلى إعداد WhatsApp Business API.');
      
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert('حدث خطأ أثناء فتح الواتساب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('تم حذف الطلب بنجاح!');
        window.location.reload();
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الطلب
              </th>
                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 العميل
               </th>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 العنوان
               </th>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 المبلغ
               </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الطلب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id.slice(-8)}
                  </div>
                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-900">
                       {order.user.name}
                     </div>
                     <div className="text-sm text-gray-500">
                       {order.user.email}
                     </div>
                     <div className="text-sm text-gray-500">
                       {order.phone}
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900 max-w-xs truncate">
                     {order.shippingAddress}
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-900">
                     {order.totalAmount.toFixed(2)} دينار ليبي
                   </div>
                   <div className="text-sm text-gray-500">
                     {order.items.length} منتج
                   </div>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2 space-x-reverse">
                                <button
                                  onClick={() => setEditingOrder(order)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  تعديل الحالة
                                </button>
                                <button
                                  onClick={() => handleSendWhatsApp(order)}
                                  disabled={isLoading}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  إرسال واتساب
                                </button>
                                <button
                                  onClick={() => handleDelete(order.id)}
                                  disabled={isLoading}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                  حذف
                                </button>
                              </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">تحديث حالة الطلب</h2>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  حالة الطلب
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">معلق</option>
                  <option value="CONFIRMED">مؤكد</option>
                  <option value="SHIPPED">تم الشحن</option>
                  <option value="DELIVERED">تم التوصيل</option>
                  <option value="CANCELLED">ملغي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أضف ملاحظات حول الطلب..."
                />
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'جاري التحديث...' : 'تحديث الحالة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable; 