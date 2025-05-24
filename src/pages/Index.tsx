
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/ContactForm";
import { ServiceCard } from "@/components/ServiceCard";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Zap, TrendingUp, Bot, Mail, Calendar } from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  const techImages = [
    "photo-1488590528505-98d2b5aba04b", // laptop
    "photo-1518770660439-4636190af475", // circuit board
    "photo-1461749280684-dccba630e2f6", // Java programming
    "photo-1581091226825-a6a2a5aee158", // woman with laptop
    "photo-1526374965328-7f61d4dc18c5", // Matrix style
    "photo-1531297484001-80022131f5a1", // laptop on surface
  ];

  const marketingImages = [
    "photo-1487058792275-0ad4aaf24ca7", // colorful code
    "photo-1605810230434-7631ac76ec81", // video screens
    "photo-1519389950473-47ba0277781c", // people with laptops
    "photo-1498050108023-c5249f4df085", // MacBook with code
    "photo-1649972904349-6e44c42644a7", // woman with laptop
    "photo-1487887235947-a955ef187fcc", // drone
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            PulseMint
          </div>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className={`min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 relative overflow-hidden transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Company Name - Shorter */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            PulseMint
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/80 mb-10 font-light max-w-2xl mx-auto">
            Simple, powerful AI automation for pretty much anything.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-0 font-semibold"
            >
              Get a Free Consultation
            </Button>
            <Button 
              onClick={() => scrollToSection('services')}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-8 py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className={`py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-1000 delay-200 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
                What We Do
              </h2>
              <div className="space-y-8">
                <ServiceCard
                  icon={<Bot className="h-12 w-12 text-blue-600" />}
                  title="AI Automation"
                  description="Automate workflows, lead follow-up, and content generation using custom AI tools."
                />
                <ServiceCard
                  icon={<TrendingUp className="h-12 w-12 text-blue-600" />}
                  title="Digital Marketing"
                  description="Campaigns powered by data, not guesswork — SEO, paid ads, and email automation."
                />
                <ServiceCard
                  icon={<Zap className="h-12 w-12 text-blue-600" />}
                  title="Workflow Systems"
                  description="Build backend systems that scale — from CRMs to full customer journeys."
                />
              </div>
            </div>
            <div className="flex justify-center">
              <ImageCarousel images={techImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Why PulseMint */}
      <section id="why" className={`py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 transition-all duration-1000 delay-300 ${isVisible.why ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            Why PulseMint?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-4">Speed</h3>
              <p className="text-gray-300 text-lg">Launch automations in days, not months</p>
            </div>
            <div className="group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
              <h3 className="text-2xl font-bold text-white mb-4">ROI-Driven</h3>
              <p className="text-gray-300 text-lg">Always focused on results, not vanity metrics</p>
            </div>
            <div className="group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-4">Personalised AI</h3>
              <p className="text-gray-300 text-lg">Tailored to your business — not one-size-fits-all tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="cases" className={`py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 transition-all duration-1000 delay-400 ${isVisible.cases ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            How We Help
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <ImageCarousel images={marketingImages} />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Lead Generation Automation</h3>
                  <p className="text-gray-600 text-lg">From visitor to qualified lead — without manual work.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Content Automation</h3>
                  <p className="text-gray-600 text-lg">30 posts/month. One input. Zero writer's block.</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">CRM Workflows</h3>
                  <p className="text-gray-600 text-lg">Auto-update, auto-nurture, auto-close.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className={`py-20 px-4 bg-gradient-to-br from-emerald-500 to-blue-600 transition-all duration-1000 delay-500 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Book a free 15-min discovery call
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Let's see how we can automate your growth. No pitch. Just value.
          </p>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold"
          >
            Book a Call
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-4 bg-gray-900 transition-all duration-1000 delay-600 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Let's Talk
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <ContactForm />
            </div>
            <div className="text-white space-y-8">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-blue-400" />
                <span className="text-lg">hello@pulsemint.co</span>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-6 w-6 text-blue-400" />
                <span className="text-lg">Schedule a call</span>
              </div>
              <div className="pt-8">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Ready to transform your business with AI automation and smart marketing? 
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
            PulseMint
          </div>
          <p className="text-gray-400">© 2024 PulseMint. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
