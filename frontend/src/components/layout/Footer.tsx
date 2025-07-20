
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Company': ['About Us', 'Careers', 'Press', 'Contact Us'],
    'Customer Service': ['Help Center', 'Returns', 'Shipping Info', 'Size Guide'],
    'Quick Links': ['Flash Deals', 'New Arrivals', 'Best Sellers', 'Sale Items'],
    'Account': ['My Account', 'Order History', 'Wishlist', 'Track Order']
  };

  return (
    <footer className="bg-muted text-muted-foreground">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Never Miss a Deal!
              </h3>
              <p>Subscribe to get exclusive offers and early access to sales</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <Input 
                placeholder="Enter your email"
                className="md:w-80"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Crazy<span className="text-destructive">Deals</span>
            </h2>
            <p className="mb-4">
              Your one-stop destination for unbeatable prices on quality products across all categories.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Button variant="link" className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground">
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <span>support@crazydeals.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5" />
              <span>1-800-CRAZY-DEAL</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5" />
              <span>New York, NY 10001</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>&copy; 2024 CrazyDeals. All rights reserved.</p>
            <div className="flex space-x-4">
              <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
              <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>
              <Button variant="link" className="p-0 h-auto text-sm">Cookie Policy</Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
