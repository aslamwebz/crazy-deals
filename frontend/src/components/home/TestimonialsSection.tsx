
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3fd?w=150&h=150&fit=crop&crop=face",
      role: "Verified Buyer",
      rating: 5,
      text: "I saved over $300 on my electronics purchase! The deals here are absolutely insane. Fast shipping and authentic products.",
      product: "iPhone 15 Pro",
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "Tech Enthusiast",
      rating: 5,
      text: "CrazyDeals is my go-to for tech gadgets. The quality is top-notch and the prices beat everywhere else. Highly recommend!",
      product: "Gaming Setup",
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "Fashion Lover",
      rating: 5,
      text: "The fashion deals are incredible! I completely refreshed my wardrobe for less than what I'd pay for one designer item elsewhere.",
      product: "Designer Handbag",
      verified: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full">
              <span className="font-bold">💬 CUSTOMER LOVE</span>
            </div>
          </div>
          <h2 className="text-4xl font-black mb-4">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Happy Customers</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who've discovered amazing deals and saved big on their favorite products.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="group relative bg-white dark:bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-200 dark:border-blue-800 hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-blue-200 dark:text-blue-800 transform rotate-180" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-5 w-5 text-yellow-400 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-lg text-foreground mb-6 leading-relaxed font-medium">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                  />
                  {testimonial.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-blue-600 font-semibold">Bought: {testimonial.product}</p>
                </div>
              </div>

              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🛡️", title: "Secure Payments", desc: "256-bit SSL encryption" },
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🏆", title: "Best Price", desc: "Price match guarantee" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white/50 dark:bg-card/50 rounded-xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
