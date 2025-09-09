"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { getUserRole } from "@/lib/auth";

const Sidebar = () => {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setUserRole(getUserRole());
    }, []);

    // Listen for auth state changes
    useEffect(() => {
        const handleAuthStateChange = () => {
            setUserRole(getUserRole());
        };

        const handleStorageChange = () => {
            setUserRole(getUserRole());
        };

        const handleFocus = () => {
            setUserRole(getUserRole());
        };

        // Listen for custom auth state change events
        window.addEventListener('authStateChanged', handleAuthStateChange);
        
        // Listen for storage changes (when user logs in/out in another tab)
        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for focus events (when user switches back to this tab)
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('authStateChanged', handleAuthStateChange);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Update user role when pathname changes (navigation)
    useEffect(() => {
        setUserRole(getUserRole());
    }, [pathname]);

    // Admin menu items
    const adminMenuItems = [
        { label: "Dashboard", route: "/" },
        {
            label: "Users",
            route: "/users",
        },
        {
            label: "Keys",
            route: "/keys",
        },
        {
            label: "Submission",
            route: "/submission",
        },
        {
            label: "Listening",
            route: "/listening",
        },
        {
            label: "Reading",
            type: "dropdown" as const,
            route: "/reading",
            children: [
                { label: "Section 1", route: "/reading/section/1" },
                { label: "Section 2", route: "/reading/section/2" },
                { label: "Section 3", route: "/reading/section/3" },
            ],
        },
        {
            label: "Writing",
            type: "dropdown" as const,
            route: "/writing",
            children: [
                { label: "Task 1", route: "/writing/task/1" },
                { label: "Task 2", route: "/writing/task/2" },
            ],
        }
    ];

    // Student menu items
    const studentMenuItems = [
        { label: "Dashboard", route: "/" },
        { label: "Mock", route: "/mock" },
    ];

    const menuItems = userRole === 'admin' ? adminMenuItems : studentMenuItems;

    if (!isClient) {
        return (
            <aside className="min-h-screen transition ease-out duration-300 w-70 border-r border-outlined bg-secondary">
                <div className="h-14 border-b border-outlined p-4 content-center">
                    <Link href={"/"} className="block">
                        <div className="flex items-center">
                            <Inventory2OutlinedIcon />
                            <h1 className="font-bold ml-2">
                                Loading...
                            </h1>
                        </div>
                    </Link>
                </div>
                <ul className="p-4">
                    <li className="text-gray-500">Loading...</li>
                </ul>
            </aside>
        );
    }

    return (
        <aside className="min-h-screen transition ease-out duration-300 w-70 border-r border-outlined bg-secondary">
            <div className="h-14 border-b border-outlined p-4 content-center">
                <Link href={"/"} className="block">
                    <div className="flex items-center">
                        <Inventory2OutlinedIcon />
                        <h1 className="font-bold ml-2">
                            {userRole === 'admin' ? 'Admin Panel' : 'Student Panel'}
                        </h1>
                    </div>
                </Link>
            </div>
            <ul className="p-4">
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        {...item}
                        currentPath={pathname}
                    />
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;