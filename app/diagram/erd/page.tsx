import React from "react";
import { TabsDemo } from "./TextTab";
import DiagramFlow from "./DiagramFlow";

const page = () => {
  return (
    <div className="flex  h-full  w-full gap-3 ">
      <div className="w-full md:w-1/3">
        <TabsDemo />
      </div>

      <div className="w-full md:w-3/4 border border-gray-100 shadow-lg rounded-2xl">
        <DiagramFlow />
      </div>
    </div>
  );
};

export default page;
