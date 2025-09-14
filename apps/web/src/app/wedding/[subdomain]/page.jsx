'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Gift,
  Camera,
  Mail,
  Phone,
  ChevronDown,
  Music,
  Sparkles
} from 'lucide-react';

export default function WeddingWebsite() {
  const { subdomain } = useParams();
  const [activeSection, setActiveSection] = useState('home');
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    attending: '',
    guestCount: 1,
    mealPreference: '',
    dietaryRestrictions: '',
    message: ''
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  // This would be fetched from API based on subdomain
  const weddingData = {
    coupleNames: {
      person1: 'Sarah Johnson',
      person2: 'Michael Chen'
    },
    eventDate: 'July 15, 2025',
    eventTime: '4:00 PM',
    venue: {
      name: 'Sunset Gardens',
      address: '123 Wedding Lane, Beverly Hills, CA 90210',
      mapUrl: 'https://maps.google.com'
    },
    story: {
      howWeMet: 'We met at a coffee shop in downtown San Francisco on a rainy afternoon in 2019...',
      firstDate: 'Our first date was at the Golden Gate Park, where we spent hours talking and walking...',
      theProposal: 'On our anniversary, Michael surprised me with a romantic proposal at the same coffee shop where we first met...'
    },
    gallery: [
      '/wedding/gallery1.jpg',
      '/wedding/gallery2.jpg',
      '/wedding/gallery3.jpg',
      '/wedding/gallery4.jpg'
    ],
    schedule: [
      { time: '3:30 PM', event: 'Guest Arrival', location: 'Main Entrance' },
      { time: '4:00 PM', event: 'Ceremony', location: 'Garden Pavilion' },
      { time: '5:00 PM', event: 'Cocktail Hour', location: 'Terrace' },
      { time: '6:00 PM', event: 'Reception', location: 'Grand Ballroom' },
      { time: '10:00 PM', event: 'After Party', location: 'Lounge' }
    ],
    registry: [
      { name: 'Amazon', url: 'https://amazon.com', icon: Gift },
      { name: 'Target', url: 'https://target.com', icon: Gift },
      { name: 'Honeymoon Fund', url: '#', icon: Heart }
    ],
    accommodations: [
      { name: 'The Beverly Hills Hotel', distance: '2 miles', rate: '$350/night', phone: '(310) 555-0100' },
      { name: 'Sunset Plaza Hotel', distance: '1 mile', rate: '$250/night', phone: '(310) 555-0200' }
    ]
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    // Submit RSVP to API
    console.log('RSVP submitted:', rsvpForm);
    setRsvpSubmitted(true);
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSubmitted(false);
      setRsvpForm({
        name: '',
        email: '',
        attending: '',
        guestCount: 1,
        mealPreference: '',
        dietaryRestrictions: '',
        message: ''
      });
    }, 3000);
  };

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Our Story' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'venue', label: 'Venue' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'registry', label: 'Registry' },
    { id: 'travel', label: 'Travel' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="text-pink-500" size={24} />
              <span className="text-lg font-serif">S & M</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`text-sm transition-colors ${
                    activeSection === section.id 
                      ? 'text-pink-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => setShowRsvpModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 text-sm font-medium"
            >
              RSVP
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="absolute inset-0 bg-[url('/wedding-bg.jpg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative text-center px-4">
          <Sparkles className="text-pink-400 mx-auto mb-4" size={32} />
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-4">
            {weddingData.coupleNames.person1}
            <span className="block text-3xl md:text-4xl my-4 font-light">&</span>
            {weddingData.coupleNames.person2}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Are Getting Married
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-gray-700">
            <div className="flex items-center">
              <Calendar className="mr-2" size={20} />
              <span>{weddingData.eventDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={20} />
              <span>{weddingData.eventTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" size={20} />
              <span>{weddingData.venue.name}</span>
            </div>
          </div>
          
          <div className="mt-12">
            <button
              onClick={() => setShowRsvpModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 text-lg font-medium shadow-lg transform hover:scale-105 transition-all"
            >
              RSVP Now
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-gray-400" size={32} />
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-12">Our Love Story</h2>
          
          <div className="space-y-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-2xl font-serif text-pink-600 mb-4">How We Met</h3>
              <p className="text-gray-600 leading-relaxed">{weddingData.story.howWeMet}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-2xl font-serif text-pink-600 mb-4">Our First Date</h3>
              <p className="text-gray-600 leading-relaxed">{weddingData.story.firstDate}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-2xl font-serif text-pink-600 mb-4">The Proposal</h3>
              <p className="text-gray-600 leading-relaxed">{weddingData.story.theProposal}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-12">Wedding Day Schedule</h2>
          
          <div className="space-y-4">
            {weddingData.schedule.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-center">
                    <p className="text-lg font-semibold text-purple-600">{item.time}</p>
                  </div>
                  <div className="border-l-2 border-pink-200 pl-4">
                    <h3 className="text-lg font-medium text-gray-900">{item.event}</h3>
                    <p className="text-sm text-gray-500">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-12">Ceremony & Reception</h2>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-200">
              {/* Map would go here */}
              <div className="h-full flex items-center justify-center text-gray-500">
                <MapPin size={48} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif text-gray-900 mb-2">{weddingData.venue.name}</h3>
              <p className="text-gray-600 mb-4">{weddingData.venue.address}</p>
              <a
                href={weddingData.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-700"
              >
                <MapPin className="mr-2" size={18} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-12">Photo Gallery</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden group cursor-pointer">
                <div className="h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                  <Camera size={48} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section id="registry" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Gift Registry</h2>
          <p className="text-gray-600 mb-12">Your presence is the greatest gift, but if you wish to honor us with a gift, we've registered at:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weddingData.registry.map((registry, index) => {
              const Icon = registry.icon;
              return (
                <a
                  key={index}
                  href={registry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                  <Icon className="text-pink-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="text-lg font-medium text-gray-900">{registry.name}</h3>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Travel Section */}
      <section id="travel" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-12">Travel & Accommodations</h2>
          
          <div className="space-y-4">
            {weddingData.accommodations.map((hotel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-500">{hotel.distance} from venue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-purple-600">{hotel.rate}</p>
                    <p className="text-sm text-gray-500">{hotel.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Heart className="text-pink-500 mx-auto mb-4" size={32} />
        <p className="text-gray-600">
          Made with love for {weddingData.coupleNames.person1} & {weddingData.coupleNames.person2}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Powered by Ruban Bleu
        </p>
      </footer>

      {/* RSVP Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowRsvpModal(false)}
            ></div>
            
            <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
              {!rsvpSubmitted ? (
                <>
                  <h3 className="text-2xl font-serif text-gray-900 mb-6">RSVP</h3>
                  
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={rsvpForm.email}
                        onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Will you attend? *
                      </label>
                      <select
                        required
                        value={rsvpForm.attending}
                        onChange={(e) => setRsvpForm({...rsvpForm, attending: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        <option value="yes">Yes, I'll be there!</option>
                        <option value="no">Sorry, can't make it</option>
                      </select>
                    </div>
                    
                    {rsvpForm.attending === 'yes' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Guests
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={rsvpForm.guestCount}
                            onChange={(e) => setRsvpForm({...rsvpForm, guestCount: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meal Preference
                          </label>
                          <select
                            value={rsvpForm.mealPreference}
                            onChange={(e) => setRsvpForm({...rsvpForm, mealPreference: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select...</option>
                            <option value="beef">Beef</option>
                            <option value="chicken">Chicken</option>
                            <option value="fish">Fish</option>
                            <option value="vegetarian">Vegetarian</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dietary Restrictions
                          </label>
                          <input
                            type="text"
                            value={rsvpForm.dietaryRestrictions}
                            onChange={(e) => setRsvpForm({...rsvpForm, dietaryRestrictions: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Allergies, preferences, etc."
                          />
                        </div>
                      </>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message for the Couple
                      </label>
                      <textarea
                        rows={3}
                        value={rsvpForm.message}
                        onChange={(e) => setRsvpForm({...rsvpForm, message: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Share your wishes..."
                      ></textarea>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowRsvpModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
                      >
                        Submit RSVP
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your RSVP has been received.</p>
                  <p className="text-gray-600">We can't wait to celebrate with you!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
