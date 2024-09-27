import React, { useActionState } from "react";
import { Bell, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { logout } from "@/app/actions/auth";
import { useFormStatus } from "react-dom";

const TopMenu: React.FC = () => {
  const [state, action] = useActionState(logout, undefined);
  const { pending } = useFormStatus();
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Aspen Jobs Tracking</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Popover>
              <PopoverTrigger asChild>
                <User size={20} />
              </PopoverTrigger>
              <PopoverContent className="w-[200px] mt-5">
                <div className="w-full flex flex-col gap-2">
                  <Button
                    formAction={action}
                    disabled={}
                    variant={"destructive"}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopMenu;
