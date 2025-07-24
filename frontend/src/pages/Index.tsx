
import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FlashDeals from '@/components/home/FlashDeals';
import TrendingSection from '@/components/home/TrendingSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <FlashDeals />
        <TrendingSection />
        <CategoryGrid />
        <FeaturedProducts />
        <TestimonialsSection />
      </main>
    </div>
  );
};

export default Index;
