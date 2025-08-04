import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OffersTable from '@/components/admin/OffersTable';
import AddOfferButton from '@/components/admin/AddOfferButton';

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  إدارة العروض والخصومات
                </h1>
                <p className="text-gray-600">
                  إدارة العروض والخصومات المعروضة في المتجر
                </p>
              </div>
              <AddOfferButton />
            </div>
          </div>

          <OffersTable />
        </main>
      </div>
    </div>
  );
} 