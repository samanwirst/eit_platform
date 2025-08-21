"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface BreadcrumbProps {
  pageName?: string;
  showBackButton?: boolean;
}

const Breadcrumb = ({ pageName, showBackButton = true }: BreadcrumbProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isReadingSection = pathname.includes('/reading/section/');
  const isWritingTask = pathname.includes('/writing/task/');
  const isWritingAdd = pathname.includes('/writing/task/') && pathname.includes('/add');

  const getBreadcrumbStructure = () => {
    if (isReadingSection) {
      const sectionNum = pathname.split('/').pop();
      return {
        main: 'Reading',
        sub: `Section ${sectionNum}`,
        mainHref: '/reading'
      };
    }
    
    if (isWritingTask) {
      const taskNum = pathname.split('/')[3]; 
      if (isWritingAdd) {
        return {
          main: 'Writing',
          sub: `Add Section ${taskNum}`,
          mainHref: '/writing'
        };
      }
      return {
        main: 'Writing',
        sub: `Task ${taskNum}`,
        mainHref: '/writing'
      };
    }

    return null;
  };

  const breadcrumbStructure = getBreadcrumbStructure();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors duration-200 p-2 rounded-md hover:bg-gray-100"
            title="Go back to previous page"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
      </div>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link 
              className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200" 
              href="/"
            >
              Dashboard
            </Link>
          </li>
          
          {breadcrumbStructure ? (
            <>
              <li className="text-gray-400">/</li>
              <li>
                <Link 
                  className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200" 
                  href={breadcrumbStructure.mainHref}
                >
                  {breadcrumbStructure.main}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="font-medium text-blue-600">{breadcrumbStructure.sub}</li>
            </>
          ) : (
            pageName && (
              <>
                <li className="text-gray-400">/</li>
                <li className="font-medium text-blue-600">{pageName}</li>
              </>
            )
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
