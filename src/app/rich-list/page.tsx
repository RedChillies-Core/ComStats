"use client";
import Image from "next/image";
import React from "react";
import RichListTable from "../components/table/richlist";
import { useGetRichListQuery } from "@/store/api/statsApi";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

const RichListPage = () => {
  const { data, refetch, isLoading } = useGetRichListQuery();
  const router = useRouter()
  return (
    <div className="container p-2 mt-4 md:p-0">
     <div className="flex py-5 items-center gap-x-3">
            <button
              className="border-2 p-2 rounded-lg cursor-pointer"
              onClick={() => router.back()}
            >
              <FaArrowLeft />
            </button>
            <h1 className="heading">Rich List</h1>
          </div>
      <RichListTable users={data || []} isLoading={isLoading} />
    </div>
  );
};

export default RichListPage;
