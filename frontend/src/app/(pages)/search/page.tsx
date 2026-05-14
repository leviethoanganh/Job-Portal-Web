import { Section1 } from "@/app/components/section/Section1";
import  {  SectionSearch  }  from  "./SectionSearch" ;
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Section1 />

      <Suspense fallback={<div className="text-center py-10">Loading search results...</div>}>
        <SectionSearch />
      </Suspense>
    </>
  );
}
