import { cn } from "@/lib/utils";
import {
  useState,
  createContext,
  useContext,
  useCallback,
  HTMLProps,
  useEffect,
} from "react";
import { Button } from "./Button";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

Sidebar.Root = function Root({ children }: { children?: React.ReactNode }) {
  const context = useContext(SidebarContext);
  return (
    <aside
      className={cn(
        "fixed right-0 top-0 w-full xs:w-[300px] h-screen bg-background z-[999] px-4 shadow-sidebar transition-transform ",
        context?.isOpen ? "translate-x-0" : "translate-x-[120%]"
      )}
    >
      {children}
    </aside>
  );
};

Sidebar.Header = function Header({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex text-xl font-semibold py-6", className)}>
      {children}
    </div>
  );
};

Sidebar.Item = function Item({
  children,
  href,
  isActive,
}: LinkProps &
  HTMLProps<HTMLAnchorElement> & {
    children?: React.ReactNode;
    isActive: boolean;
  }) {
  return (
    <Link
      href={href}
      className={
        !isActive
          ? "w-full p-3 hover:bg-muted rounded-sm"
          : "w-full p-3 bg-muted rounded-sm"
      }
    >
      {children}
    </Link>
  );
};

Sidebar.Content = function Content({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex flex-col space-y-4 py-6">{children}</div>;
};

Sidebar.Trigger = function Trigger({
  children,
}: {
  children?: React.ReactNode;
}) {
  const context = useContext(SidebarContext);
  return (
    <Button variant="ghost" size="xs" onClick={context?.toggleSidebar}>
      {children}
    </Button>
  );
};
