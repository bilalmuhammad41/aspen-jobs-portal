"use client";

import JobListItem from "./job-list-item";
import JobsService from "@/services/job.service";
import JobItemFallback from "./job-item-fallback";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { SearchX } from "lucide-react";

interface JobListProps {
  searchQuery: string;
}

export default function JobList({ searchQuery }: JobListProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { useFetchAllJobs } = JobsService();
  const { data: jobs, isLoading } = useFetchAllJobs(page, limit, searchQuery);

  if (isLoading || !jobs) {
    return (
      <>
        <JobItemFallback />
        <JobItemFallback />
        <JobItemFallback />
      </>
    );
  }

  const totalPages = Math.ceil(jobs?.pagination?.total / limit);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  if (jobs?.data?.length == 0){
return (
  <div className="w-full px-4 py-12 flex flex-col items-center justify-center text-center">
  <div className="mb-5">
    <SearchX className="w-20 h-20 text-gray-400" />
  </div>
  <h2 className="text-xl font-bold text-gray-900 mb-2">
    No Jobs Found
  </h2>
  <p className="text-md text-gray-600 mb-8 max-w-md">
    We couldn&apos;t find any jobs matching your criteria. Try adjusting your search or check back later for new entries.
  </p>
</div>
)
  }
  return (
    <div className="flex flex-col w-full gap-3 animate-in">
      {jobs?.data?.map((job, index) => (
        <JobListItem key={index} jobId={job?.id} />
      ))}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`${page === 1 && "bg-secondary pointer-events-none"} `}
              href="#"
              onClick={handlePreviousPage}
            />
          </PaginationItem>

          {/* Render page numbers dynamically */}
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => handlePageClick(index + 1)}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className={`${
                page === totalPages && "bg-secondary pointer-events-none"
              } `}
              href="#"
              onClick={handleNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
