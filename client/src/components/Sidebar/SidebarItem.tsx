import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

interface BaseSidebarItem {
    label: string;
    currentPath: string;
    icon?: React.ComponentType<any>;
}

interface LinkItem extends BaseSidebarItem {
    type?: "link";
    route: string;
}

interface DropdownItem extends BaseSidebarItem {
    type: "dropdown";
    children: { label: string; route: string; }[];
    route: string; // Add route for main navigation
}

type SidebarItemProps = LinkItem | DropdownItem;

const SidebarItem = (props: SidebarItemProps) => {
    const router = useRouter();

    if (props.type === "dropdown") {
        const isActive = props.children.some(
            child =>
                (props.currentPath === child.route || props.currentPath.startsWith(child.route + "/"))
        );
        const [open, setOpen] = useState(isActive);

        useEffect(() => {
            setOpen(isActive);
        }, [isActive]);

        const handleMainClick = () => {
            // Navigate to main page AND toggle dropdown
            router.push(props.route);
            setOpen(!open);
        };

        return (
            <li className="transition ease-out duration-300 rounded-lg text-smoke hover:text-black">
                <div
                    className={`cursor-pointer py-2 ml-4 text-sm font-medium flex items-center justify-between pr-4`}
                    onClick={handleMainClick}
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
                            <li
                                key={idx}
                                className={`transition ease-out duration-300 text-smoke rounded-lg hover:text-black`}
                            >
                                <Link href={child.route} className="block py-2 text-sm ml-4">
                                    {child.label}
                                </Link>
                            </li>
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
            <Link href={props.route} className="py-2 text-sm ml-4 flex items-center">
                {props.icon && <props.icon className="mr-2" fontSize="small" />}
                {props.label}
            </Link>
        </li>
    );
};

export default SidebarItem;