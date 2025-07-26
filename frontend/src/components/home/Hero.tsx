
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Star, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Black Friday Mega Sale",
      subtitle: "Up to 90% OFF Everything",
      description: "The biggest deals of the year are here! Don't miss out on incredible savings across all categories.",
      cta: "Shop Now",
      ctaLink: "/deals",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=1080&fit=crop&crop=center",
      price: "Starting at $9.99",
      originalPrice: "$99.99",
      gradient: "from-red-600/90 via-red-700/80 to-black/50"
    },
    {
      id: 2,
      title: "Tech Revolution",
      subtitle: "Latest Electronics at Unbeatable Prices",
      description: "iPhone 15, MacBook Pro, Samsung Galaxy and more with up to 70% off retail prices.",
      cta: "Explore Tech",
      ctaLink: "/shop?categories=electronics",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop&crop=center",
      price: "From $199",
      originalPrice: "$899",
      gradient: "from-blue-600/90 via-purple-700/80 to-black/50"
    },
    {
      id: 3,
      title: "Fashion Flash Sale",
      subtitle: "Trendy Styles, Crazy Prices",
      description: "Refresh your wardrobe with the latest fashion trends at prices that won't break the bank.",
      cta: "Shop Fashion",
      ctaLink: "/shop?categories=clothing",
      image: "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=1920&h=1080&fit=crop&crop=center",
      price: "Up to 85% OFF",
      originalPrice: "Retail Price",
      gradient: "from-pink-600/90 via-rose-700/80 to-black/50"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          
          {/* Animated Elements */}
          <div className="absolute inset-0">
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="space-y-6 animate-fade-in">
                  {/* Badge */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <Zap className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
                      <span className="text-white text-sm font-semibold">Limited Time Offer</span>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <span className="ml-2 text-white text-sm">Rated #1 for Deals</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                      <span className="block">{slide.title.split(' ')[0]}</span>
                      <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        {slide.title.split(' ').slice(1).join(' ')}
                      </span>
                    </h1>
                    
                    <h2 className="text-2xl md:text-4xl font-bold text-white/90">
                      {slide.subtitle}
                    </h2>
                    
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                      {slide.description}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-3xl font-black text-white">{slide.price}</p>
                          <p className="text-sm text-white/60 line-through">{slide.originalPrice}</p>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div className="text-center">
                          <p className="text-sm text-white/80">Save up to</p>
                          <p className="text-2xl font-bold text-green-400">90%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-6">
                    <Link to={slide.ctaLink} className="inline-flex items-center">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
                      >
                        <Play className="h-5 w-5 mr-2 fill-current" />
                        {slide.cta}
                      </Button>
                    </Link>
                    
                    <Link to="/deals" className="inline-flex items-center">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-2 border-white/30 bg-black/30 hover:bg-white/20 text-white hover:text-white px-8 py-4 rounded-full text-lg backdrop-blur-sm group transition-all duration-300"
                      >
                        View All Deals
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`relative overflow-hidden transition-all duration-500 ${
                index === currentSlide ? 'w-12 bg-white' : 'w-3 bg-white/50'
              } h-3 rounded-full`}
              onClick={() => setCurrentSlide(index)}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floating CTA */}
      <div className="absolute bottom-8 right-8 hidden md:block">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold animate-bounce shadow-2xl">
          <span className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            New deals every hour!
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
