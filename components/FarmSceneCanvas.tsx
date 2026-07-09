"use client";

import dynamic from "next/dynamic";

const FarmScene = dynamic(() => import("./FarmScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-leaf-200/20" />,
});

export default function FarmSceneCanvas() {
  return (
    <div className="relative h-[320px] w-full sm:h-[420px]">
      <FarmScene />
    </div>
  );
}
