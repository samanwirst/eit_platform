"use client";
// import React, { useState } from "react";
import Sidebar from "../Sidebar";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen transition ease-out duration-300 bg-primary">
        <Sidebar />

        <div className="flex flex-1 flex-col">
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