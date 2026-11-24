import { Suspense } from "react";
import DonateCharity from "./DonateCharityClient";

export default function DonateCharityPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl p-6">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      }
    >
      <DonateCharity params={params} />
    </Suspense>
  );
}
