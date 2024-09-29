import {
  Home,
  LineChart,
  Menu,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import DashboardNav from "./nav-link";

export default function SideMenu({role = "STAKEHOLDER"}:{role: string | undefined}) {
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
       <DashboardNav role={role}/>
      </SheetContent>
    </Sheet>
  );
}
