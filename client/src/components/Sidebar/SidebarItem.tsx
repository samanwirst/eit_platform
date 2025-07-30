import Link from "next/link";
import { useState, useEffect } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

interface BaseSidebarItem {
    label: string;
    currentPath: string;
}

interface LinkItem extends BaseSidebarItem {
    type?: "link";
    route: string;
}

interface DropdownItem extends BaseSidebarItem {
    type: "dropdown";
    children: SidebarItemProps[];
}

type SidebarItemProps = LinkItem | DropdownItem;


const SidebarItem = (props: SidebarItemProps) => {
    if (props.type === "dropdown") {
        const isActive = props.children.some(
            child =>
                "route" in child &&
                (props.currentPath === child.route || props.currentPath.startsWith(child.route + "/"))
        );
        const [open, setOpen] = useState(isActive);

        useEffect(() => {
            setOpen(isActive);
        }, [isActive]);

        return (
            <li className="transition ease-out duration-300 rounded-lg text-smoke hover:text-black">
                <div
                    className={`cursor-pointer py-2 ml-4 text-sm font-medium flex items-center justify-between pr-4`}
                    onClick={() => setOpen((o) => !o)}
                >
                    <span>{props.label}</span>
                    {open ? (
                        <KeyboardArrowUpOutlinedIcon fontSize="small" />
                    ) : (
                        <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    )}
                </div>
                {open && (
                    <ul className="ml-4">
                        {props.children.map((child, idx) => (
                            <SidebarItem
                                key={idx}
                                {...child}
                                currentPath={props.currentPath}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    const isActive = props.currentPath === props.route ||
        props.currentPath.startsWith(props.route + "/");

    return (
        <li
            className={`transition ease-out duration-300 text-smoke rounded-lg ${isActive
                ? "!bg-selected-primary"
                : "hover:text-black"
                }`}
        >
            <Link href={props.route} className="block py-2 text-sm ml-4">
                {props.label}
            </Link>
        </li>
    );
};

export default SidebarItem;