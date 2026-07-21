import { getFeaturedProducts, getNewArrivals } from "@/lib/products";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();

  return <HomeClient featured={JSON.parse(JSON.stringify(featured))} newArrivals={JSON.parse(JSON.stringify(newArrivals))} />;
}
