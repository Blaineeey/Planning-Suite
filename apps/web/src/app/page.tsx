'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  Users, 
  Globe, 
  CreditCard,
  ArrowRight,
  Menu,
  X,
  Star,
  Play,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If authenticated, redirect based on role
    if (isAuthenticated && user) {
      if (user.role === 'CLIENT') {
        router.push('/client/dashboard');
      } else if (['ADMIN', 'OWNER', 'PLANNER'].includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: Calendar,
      title: 'Project Management',
      description: 'Manage all your wedding projects in one place with timelines, tasks, and deadlines.'
    },
    {
      icon: Users,
      title: 'Guest Management',
      description: 'Track RSVPs, meal preferences, seating arrangements, and guest communications.'
    },
    {
      icon: Globe,
      title: 'Wedding Websites',
      description: 'Create beautiful, customizable wedding websites with built-in RSVP functionality.'
    },
    {
      icon: CreditCard,
      title: 'Payments & Invoicing',
      description: 'Send proposals, manage contracts, and process payments all in one platform.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Bride',
      content: 'Ruban Bleu made planning our wedding so much easier! The guest management and website builder were lifesavers.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Wedding Planner',
      content: 'As a professional planner, this platform has everything I need to manage multiple weddings efficiently.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Bride',
      content: 'The vendor directory and budget tracking features helped us stay organized and on budget!',
      rating: 5
    }
  ];

  const pricing = [
    {
      name: 'Basic',
      price: '$29',
      period: '/month',
      features: [
        'Up to 2 active projects',
        'Guest management (up to 100)',
        'Basic wedding website',
        'Email support'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      features: [
        'Unlimited projects',
        'Unlimited guests',
        'Premium website templates',
        'Payment processing',
        'Priority support',
        'Vendor directory access'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      features: [
        'Everything in Professional',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Training sessions'
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RB</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Ruban Bleu</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-4 py-2 space-y-1">
              <a href="#features" className="block py-2 text-gray-600">Features</a>
              <a href="#pricing" className="block py-2 text-gray-600">Pricing</a>
              <a href="#testimonials" className="block py-2 text-gray-600">Testimonials</a>
              <a href="#contact" className="block py-2 text-gray-600">Contact</a>
              <hr className="my-2" />
              <Link href="/login" className="block py-2 text-gray-600">Sign In</Link>
              <Link href="/register" className="block py-2 text-purple-600 font-medium">Start Free Trial</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} className="mr-1" />
              All-in-One Wedding Planning Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Plan Your Perfect Wedding
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Without the Stress
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of couples and wedding planners who use Ruban Bleu to manage 
              every aspect of their wedding planning journey in one beautiful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 flex items-center justify-center"
              >
                Start Your Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                <Play size={20} className="mr-2" />
                Watch Demo
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Hero Image */}
          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 transform skew-y-3 rounded-3xl opacity-10"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <div className="aspect-video bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                  <p className="text-gray-600">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan Your Dream Wedding
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From vendor management to guest lists, we've got you covered with powerful tools 
              designed specifically for modern wedding planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vendor Directory & Management
              </h3>
              <ul className="space-y-3">
                {[
                  'Browse verified vendors in your area',
                  'Compare prices and read reviews',
                  'Manage contracts and communications',
                  'Track payments and deadlines'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Vendor Overview</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="space-y-3">
                  {['Photography', 'Catering', 'Florist', 'Music'].map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{vendor}</span>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your wedding planning needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl transform scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle size={20} className={`mr-2 mt-0.5 ${
                        plan.highlighted ? 'text-white' : 'text-green-500'
                      }`} />
                      <span className={plan.highlighted ? 'text-white' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-purple-600 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Couples & Planners
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Planning Your Dream Wedding?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of happy couples and start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 font-medium backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RB</span>
                </div>
                <span className="text-xl font-bold">Ruban Bleu</span>
              </div>
              <p className="text-gray-400">
                The complete wedding planning platform for modern couples and planners.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  hello@rubanbleu.com
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  1-800-WEDDING
                </li>
                <li className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ruban Bleu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
