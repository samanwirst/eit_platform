"use client";
import { useRouter } from "next/navigation";
import Sidebar from "../Sidebar";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from "@/lib/auth";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <div className="flex min-h-screen transition ease-out duration-300 bg-primary">
        <Sidebar />

        <div className="flex flex-1 flex-col relative">
          {/* Logout Button - Top Right */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg cursor-pointer"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}