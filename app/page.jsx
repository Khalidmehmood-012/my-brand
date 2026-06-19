import HeroBanner from '@/components/home/HeroBanner'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import PromoSection from '@/components/home/PromoSection'
import NewsletterSection from '@/components/home/NewsletterSection'

export default function HomePage() {
  return (
    <div>
      {/* Hero Banner Slider */}
      <HeroBanner />

      {/* Shop By Category */}
      <CategoryGrid />

      {/* Most Popular Picks */}
      <FeaturedProducts />

      {/* Sale Promo Banners */}
      <PromoSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  )
}