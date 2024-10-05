'use client'

import { Input } from "@/components/ui/input";
import JobList from "./job-list";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export default function JobListWrapper() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-2 items-center pb-5 md:ml-auto md:absolute md:top-[-60px] md:right-5">
        <Input 
          className="max-w-[250px]" 
          placeholder="Search" 
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button size={"icon"} className="aspect-square">
          <Search size={15} />
        </Button>
      </div>
      <JobList searchQuery={searchQuery} />
    </div>
  );
}