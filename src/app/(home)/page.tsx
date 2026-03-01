import Banner from "@/components/home/banner";
import Category from "@/components/home/Category";
import HotDeal from "@/components/home/hot-deal";
import ProductGrid from "@/components/home/ProductGrid";

export default function Home() {
  return (
    <>
      <div>
        <Banner />

        <Category />

        <ProductGrid />
        <HotDeal />
      </div>
    </>
  );
}
