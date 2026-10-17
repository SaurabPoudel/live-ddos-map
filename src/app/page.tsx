"use client";

import Analytics from "@/components/Analytics";
import Sider from "@/components/Sider";
import dynamic from "next/dynamic";

const World = dynamic(
  () => import("@/components/ui/globe").then((module) => module.World),
  { ssr: false },
);

export const sampleArcs = [
  {
    order: 1,
    startLat: 37.7749,
    startLng: -122.4194, // San Francisco
    endLat: 40.7128,
    endLng: -74.006,    // New York
    arcAlt: 0.1,
    color: "#3b82f6",   // Blue
  },
  {
    order: 2,
    startLat: 40.7128,
    startLng: -74.006,    // New York
    endLat: 51.5074,
    endLng: -0.1278,    // London
    arcAlt: 0.3,
    color: "#a855f7",   // Purple
  },
  {
    order: 3,
    startLat: 51.5074,
    startLng: -0.1278,    // London
    endLat: 35.6762,
    endLng: 139.6503,   // Tokyo
    arcAlt: 0.5,
    color: "#ec4899",   // Pink
  },
  {
    order: 4,
    startLat: 35.6762,
    startLng: 139.6503,   // Tokyo
    endLat: 1.3521,
    endLng: 103.8198,   // Singapore
    arcAlt: 0.2,
    color: "#10b981",   // Emerald Green
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,   // Singapore
    endLat: -33.8688,
    endLng: 151.2093,   // Sydney
    arcAlt: 0.3,
    color: "#f59e0b",   // Amber
  },
  {
    order: 6,
    startLat: -33.8688,
    startLng: 151.2093,   // Sydney
    endLat: 37.7749,
    endLng: -122.4194, // San Francisco
    arcAlt: 0.4,
    color: "#3b82f6",   // Blue
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-500 flex h-full border border-red-500 justify-between ">
      <div className="absolute p-6  flex  justify-center">
        <h1 className="text-2xl font-bold mr-4 p-2 text-red-500">Live DDOS Attack Visualizer 
      </h1>       
      <span className="flex border border-green-500 rounded-xl p-2 "> 
        <span className="relative flex size-3 mt-1.5  justify-between">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
        </span>
        <span className="ps-2">Live  </span>
        </span>
 </div>
      <div className="flex-1 flex items-center justify-center relative h-screen border border-red-500">
  <div className="w-full h-full border border-red-500">
    <World globeConfig={{ pointSize: 3, pointLight: "#ffffff", globeColor: "blue" }} data={sampleArcs} />
  </div>
</div>
      <Sider/>
    </main>
  );
}
