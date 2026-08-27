import type {ReactNode} from "react";

type IconProps = { className?: string };

function Icon({className = "size-4", children}: IconProps & { children: ReactNode }) {
    return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        {children}
    </svg>;
}

export function SearchIcon(props: IconProps) {
    return <Icon {...props}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></Icon>;
}

export function ShoppingCartIcon(props: IconProps) {
    return <Icon {...props}><path d="M3.5 4.5h2l1.7 10.1a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 1.9-1.4l1.5-5.4H6.3"/><circle cx="9.4" cy="20" r="1"/><circle cx="17.2" cy="20" r="1"/></Icon>;
}

export function StoreIcon(props: IconProps) {
    return <Icon {...props}><path d="M4 10v9.5h16V10"/><path d="M3 10h18l-1.5-6h-15L3 10Z"/><path d="M8 10v2a2 2 0 0 0 4 0v-2a2 2 0 0 0 4 0v-2"/></Icon>;
}

export function SparklesIcon(props: IconProps) {
    return <Icon {...props}><path d="m12 3 1.3 4.2L17.5 9l-4.2 1.3L12 14.5l-1.3-4.2L6.5 9l4.2-1.8L12 3Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z"/><path d="m5 14 .6 1.9L7.5 17l-1.9.6L5 19.5l-.6-1.9L2.5 17l1.9-.6L5 14Z"/></Icon>;
}

export function ArrowRightIcon(props: IconProps) {
    return <Icon {...props}><path d="M4 12h15"/><path d="m14 6 6 6-6 6"/></Icon>;
}

export function PackageIcon(props: IconProps) {
    return <Icon {...props}><path d="m12 3 8 4.3v9.4L12 21l-8-4.3V7.3L12 3Z"/><path d="m4.3 7.4 7.7 4.1 7.7-4.1M12 11.5V21"/></Icon>;
}

export function ChevronLeftIcon(props: IconProps) {
    return <Icon {...props}><path d="m15 18-6-6 6-6"/></Icon>;
}

export function ChevronRightIcon(props: IconProps) {
    return <Icon {...props}><path d="m9 18 6-6-6-6"/></Icon>;
}

export function TrashIcon(props: IconProps) {
    return <Icon {...props}><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3"/></Icon>;
}
