"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", route: "/" },
        {
            label: "Users",
            route: "/users",
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

    return (
        <aside className="h-screen transition ease-out duration-300 w-70 border-r border-outlined bg-secondary">
            <div className="h-14 border-b border-outlined p-4 content-center">
                <Link href={"/"} className="block">
                    <div className="flex items-center">
                        <Inventory2OutlinedIcon />
                        <h1 className="font-bold ml-2">
                            Admin Panel
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