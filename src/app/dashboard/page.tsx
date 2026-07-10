import { db } from "@/db";
import { farmerProfiles, soilReports, orders, produceListings, loanApplications, communityPosts } from "@/db/schema";
import { sql } from "drizzle-orm";
import {
  Sprout, CloudSun, ShieldCheck, ShoppingBag, Store, HandCoins,
  Tractor, Users, TrendingUp, Droplets, Thermometer, Wind,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [farmers] = await db.select({ count: sql<number>`count(*)::int` }).from(farmerProfiles);
  const [soilReps] = await db.select({ count: sql<number>`count(*)::int` }).from(soilReports);
  const [orderCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
  const [listings] = await db.select({ count: sql<number>`count(*)::int` }).from(produceListings);
  const [loans] = await db.select({ count: sql<number>`count(*)::int` }).from(loanApplications);
  const [posts] = await db.select({ count: sql<number>`count(*)::int` }).from(communityPosts);
  return {
    farmers: farmers.count,
    soilReports: soilReps.count,
    orders: orderCount.count,
    listings: listings.count,
    loans: loans.count,
    posts: posts.count,
  };
}

const quickActions = [
  { href: "/dashboard/crops", label: "Plan Crops", icon: Sprout, color: "bg-leaf-100 text-leaf-600" },
  { href: "/dashboard/weather", label: "Check Weather", icon: CloudSun, color: "bg-sky-100 text-sky-600" },
  { href: "/dashboard/insurance", label: "Insurance", icon: ShieldCheck, color: "bg-emerald-100 text-emerald-600" },
  { href: "/dashboard/marketplace", label: "Buy Inputs", icon: ShoppingBag, color: "bg-orange-100 text-orange-600" },
  { href: "/dashboard/sell", label: "Sell Produce", icon: Store, color: "bg-teal-100 text-teal-600" },
  { href: "/dashboard/loans", label: "Apply Loan", icon: HandCoins, color: "bg-yellow-100 text-yellow-600" },
  { href: "/dashboard/equipment", label: "Book Equipment", icon: Tractor, color: "bg-rose-100 text-rose-600" },
  { href: "/dashboard/community", label: "Community", icon: Users, color: "bg-blue-100 text-blue-600" },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="rounded-2xl border border-leaf/20 bg-gradient-to-r from-leaf-50 to-leaf-100/50 p-6">
        <h1 className="text-2xl font-bold text-soil">Welcome to your Farm Dashboard 🌾</h1>
        <p className="mt-1 text-soil-600">
          Manage all your farming activities from one place.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Farmers", value: stats.farmers, icon: Users, color: "text-blue-600" },
          { label: "Soil Reports", value: stats.soilReports, icon: Droplets, color: "text-amber-600" },
          { label: "Orders", value: stats.orders, icon: ShoppingBag, color: "text-orange-600" },
          { label: "Listings", value: stats.listings, icon: Store, color: "text-teal-600" },
          { label: "Loan Apps", value: stats.loans, icon: HandCoins, color: "text-yellow-600" },
          { label: "Posts", value: stats.posts, icon: Users, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-soil/5 bg-white p-4">
            <div className="flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-soil-500">{s.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-soil">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Weather card */}
      <div className="rounded-2xl border border-sky-blue/20 bg-gradient-to-br from-sky-50 to-blue-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-soil">
          <CloudSun className="h-5 w-5 text-sky-blue" />
          Today&apos;s Weather
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white/80 p-4 text-center">
            <Thermometer className="mx-auto h-5 w-5 text-red-500" />
            <p className="mt-2 text-2xl font-bold text-soil">32°C</p>
            <p className="text-xs text-soil-500">Temperature</p>
          </div>
          <div className="rounded-xl bg-white/80 p-4 text-center">
            <Droplets className="mx-auto h-5 w-5 text-blue-500" />
            <p className="mt-2 text-2xl font-bold text-soil">72%</p>
            <p className="text-xs text-soil-500">Humidity</p>
          </div>
          <div className="rounded-xl bg-white/80 p-4 text-center">
            <Wind className="mx-auto h-5 w-5 text-teal-500" />
            <p className="mt-2 text-2xl font-bold text-soil">12 km/h</p>
            <p className="text-xs text-soil-500">Wind Speed</p>
          </div>
          <div className="rounded-xl bg-white/80 p-4 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-green-500" />
            <p className="mt-2 text-2xl font-bold text-soil">Good</p>
            <p className="text-xs text-soil-500">Crop Conditions</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-soil">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="card-hover flex flex-col items-center gap-3 rounded-xl border border-soil/5 bg-white p-5 text-center"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.color}`}>
                <a.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-soil">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
