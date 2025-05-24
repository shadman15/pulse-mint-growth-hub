import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/ContactForm";
import { ServiceCard } from "@/components/ServiceCard";
import { Zap, TrendingUp, Bot, Mail, Calendar, Menu } from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

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
    <div className="min-h-screen">
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

      {/* Hero Section - Carrd Style */}
      <section id="hero" className={`min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 relative overflow-hidden transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo Icon - Centered */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Company Name - Large and Prominent */}
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            PulseMint
          </h1>

          {/* Tagline - Simple and Clean */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-2xl mx-auto">
            Simple, powerful AI automation for pretty much anything.
          </p>

          {/* Action Buttons - Carrd Style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-0 font-semibold"
            >
              Get a Free Consultation
            </Button>
            <Button 
              onClick={() => scrollToSection('services')}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-8 py-4 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className={`py-20 px-4 bg-white transition-all duration-1000 delay-200 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
      </section>

      {/* Why PulseMint */}
      <section id="why" className={`py-20 px-4 bg-gray-50 transition-all duration-1000 delay-300 ${isVisible.why ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
            Why PulseMint?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Speed</h3>
              <p className="text-gray-600 text-lg">Launch automations in days, not months</p>
            </div>
            <div className="group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ROI-Driven</h3>
              <p className="text-gray-600 text-lg">Always focused on results, not vanity metrics</p>
            </div>
            <div className="group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalised AI</h3>
              <p className="text-gray-600 text-lg">Tailored to your business — not one-size-fits-all tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="cases" className={`py-20 px-4 bg-white transition-all duration-1000 delay-400 ${isVisible.cases ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            How We Help
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
      </section>

      {/* Call to Action */}
      <section id="cta" className={`py-20 px-4 bg-gray-50 transition-all duration-1000 delay-500 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Book a free 15-min discovery call
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Let's see how we can automate your growth. No pitch. Just value.
          </p>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
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
