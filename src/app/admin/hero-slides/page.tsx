import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import HeroSlidesTable from '@/components/admin/HeroSlidesTable';
import AddHeroSlideButton from '@/components/admin/AddHeroSlideButton';

export default function HeroSlidesPage() {
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
                  إدارة شرائح Hero
                </h1>
                <p className="text-gray-600">
                  إدارة الشرائح المعروضة في الصفحة الرئيسية
                </p>
              </div>
              <AddHeroSlideButton />
            </div>
          </div>

          <HeroSlidesTable />
        </main>
      </div>
    </div>
  );
} 