import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '../state/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { Heart, Menu, User, LogOut, Brain, Shield, CreditCard, Scale, FileText, Eye, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { logout } from '@/lib/auth';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);




  const navItems = [
    { href: "/", label: "Home", icon: Brain },
    { href: "/emdr-session", label: "Therapy Session", icon: Heart },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };



  const handleSignOut = async () => {
    await logout();
    try {
      document.querySelectorAll('video').forEach(v => v.pause());
      document.querySelectorAll('audio').forEach(a => a.pause());
    } catch {}
    window.location.assign('/');
  };

  return (
    <nav className="bg-card shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <Logo variant="header" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={`${isActive(item.href) ? 'text-primary bg-primary/10' : 'text-slate-700 hover:text-primary'}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Subscription Status */}
                {user.subscriptionStatus === 'trial' && (
                  <Link href="/subscribe">
                    <Badge variant="secondary" className="hover:bg-primary hover:text-white cursor-pointer">
                      Trial: {user.trialEndsAt ? 
                        Math.ceil((new Date(user.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                        : 0} days left
                    </Badge>
                  </Link>
                )}

                {user.subscriptionStatus === 'active' && (
                  <Badge variant="default" className="bg-primary-green">
                    Premium
                  </Badge>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />

                    <Link href="/resources">
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        EMDR Resources
                      </DropdownMenuItem>
                    </Link>



                    <a href="mailto:support@emdrise.com">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </DropdownMenuItem>
                    </a>

                    <DropdownMenuSeparator />

                    {/* Legal Section */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Scale className="h-4 w-4 mr-2" />
                        Legal
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <Link href="/terms-of-use">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Terms of Use
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/privacy-policy">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Privacy Policy
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/legal-disclaimer">
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Legal Disclaimer
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem 
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {user ? (
                  <Button 
                    variant="ghost"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </Button>
                ) : (
                  <Link href="/auth">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto p-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-100">
                <div className="flex flex-col min-h-full">
                  {/* Header with branding */}
                  <div className="bg-gradient-to-r from-primary/20 via-primary-green/20 to-secondary-blue/20 p-6 border-b border-primary/30">
                    <Link href="/" className="flex items-center justify-center">
                      <Logo variant="mobile" />
                    </Link>
                  </div>

                  {user ? (
                    <>
                      {/* User Info Card */}
                      <div className="m-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-primary/30 shadow-sm">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-green rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary-green">{user.username}</p>
                            <p className="text-sm text-secondary-blue/80">{user.email}</p>
                          </div>
                        </div>
                        {user.subscriptionStatus === 'trial' && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                            Trial: {user.trialEndsAt ? 
                              Math.ceil((new Date(user.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                              : 0} days left
                          </Badge>
                        )}
                        {user.subscriptionStatus === 'active' && (
                          <Badge variant="default" className="bg-gradient-to-r from-primary-green to-green-600 text-white border-0">
                            ✓ Premium Active
                          </Badge>
                        )}
                      </div>

                      {/* Navigation Links */}
                      <div className="flex-1 px-4 space-y-3 overflow-y-auto pb-4">
                        <div className="mb-2">
                          <p className="text-xs font-medium text-secondary-blue/70 uppercase tracking-wider mb-3 px-2">Navigation</p>
                        </div>
                        {navItems.map((item, index) => (
                          <Link key={item.href} href={item.href}>
                            <Button 
                              variant="ghost" 
                              className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                                isActive(item.href) 
                                  ? 'bg-gradient-to-r from-primary/20 to-primary-green/20 text-primary border border-primary/40 shadow-sm' 
                                  : 'text-secondary-blue hover:bg-white/80 hover:text-primary-green hover:shadow-sm'
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className={`p-2 rounded-lg mr-3 ${
                                isActive(item.href) 
                                  ? 'bg-primary/30 text-white' 
                                  : 'bg-primary-green/20 text-primary-green'
                              }`}>
                                <item.icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{item.label}</span>
                            </Button>
                          </Link>
                        ))}

                        {/* Support Section */}
                        <div className="pt-6">
                          <p className="text-xs font-medium text-secondary-blue/70 uppercase tracking-wider mb-3 px-2">Support</p>
                          <a href="mailto:support@emdrise.com">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-12 rounded-xl text-secondary-blue hover:bg-white/80 hover:text-primary-green hover:shadow-sm transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className="p-2 rounded-lg mr-3 bg-primary-green/20 text-primary-green">
                                <Mail className="h-4 w-4" />
                              </div>
                              <span className="font-medium">Contact</span>
                            </Button>
                          </a>
                        </div>

                        {/* Legal Section */}
                        <div className="pt-4">
                          <p className="text-xs font-medium text-secondary-blue/70 uppercase tracking-wider mb-3 px-2">Legal</p>
                          <Link href="/terms-of-use">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-10 rounded-lg text-secondary-blue/80 hover:bg-white/60 hover:text-primary-green transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <FileText className="h-3 w-3 mr-3 text-primary-green/70" />
                              <span className="text-sm">Terms of Use</span>
                            </Button>
                          </Link>
                          <Link href="/privacy-policy">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-10 rounded-lg text-secondary-blue/80 hover:bg-white/60 hover:text-primary-green transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Eye className="h-3 w-3 mr-3 text-primary-green/70" />
                              <span className="text-sm">Privacy Policy</span>
                            </Button>
                          </Link>
                        </div>

                      </div>

                      {/* Logout Button */}
                      <div className="p-4 border-t border-primary/30 bg-gradient-to-r from-blue-50/80 to-green-50/80">
                        <Button 
                          variant="outline" 
                          className="w-full justify-center h-12 rounded-xl border-secondary-blue/30 text-secondary-blue hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          <span className="font-medium">Sign Out</span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Welcome Message for Logged Out Users */}
                      <div className="px-4 py-6">
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-primary/30 shadow-lg">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Heart className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-primary-green mb-2">Welcome to EMDRise</h3>
                          <p className="text-sm text-secondary-blue/90 mb-4">Professional EMDR therapy for healing and growth</p>
                          <div className="text-xs text-primary-green font-medium bg-gradient-to-r from-primary/10 to-primary-green/10 rounded-lg p-2">
                            ✓ 7-day free trial • £12.99/month after trial • ✓ Cancel anytime
                          </div>
                        </div>
                      </div>

                      {/* Login/Register Section */}
                      <div className="px-4 space-y-4">
                        <Link href="/auth">
                          <Button 
                            className="w-full h-12 bg-gradient-to-r from-primary to-primary-green hover:from-primary/90 hover:to-primary-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Start Your Free Trial
                          </Button>
                        </Link>
                      </div>

                      {/* Quick Info Section */}
                      <div className="px-4 py-6 space-y-4">
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-secondary-blue/70 uppercase tracking-wider mb-3">About EMDR</h4>
                          <div className="bg-gradient-to-r from-white/70 to-white/50 rounded-lg p-4 border border-primary/20 shadow-sm">
                            <p className="text-sm text-secondary-blue leading-relaxed">
                              EMDR (Eye Movement Desensitization and Reprocessing) is a proven therapy for trauma, anxiety, and emotional healing.
                            </p>
                          </div>
                        </div>

                        {/* Contact for logged out users */}
                        <div className="pt-4">
                          <a href="mailto:support@emdrise.com">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-12 rounded-xl text-secondary-blue hover:bg-white/80 hover:text-primary-green hover:shadow-sm transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className="p-2 rounded-lg mr-3 bg-primary-green/20 text-primary-green">
                                <Mail className="h-4 w-4" />
                              </div>
                              <span className="font-medium">Contact Support</span>
                            </Button>
                          </a>
                        </div>

                        {/* Legal for logged out users */}
                        <div className="pt-2">
                          <p className="text-xs font-medium text-secondary-blue/70 uppercase tracking-wider mb-3 px-2">Legal</p>
                          <Link href="/terms-of-use">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-10 rounded-lg text-secondary-blue/80 hover:bg-white/60 hover:text-primary-green transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <FileText className="h-3 w-3 mr-3 text-primary-green/70" />
                              <span className="text-sm">Terms of Use</span>
                            </Button>
                          </Link>
                          <Link href="/privacy-policy">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-10 rounded-lg text-secondary-blue/80 hover:bg-white/60 hover:text-primary-green transition-all duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Eye className="h-3 w-3 mr-3 text-primary-green/70" />
                              <span className="text-sm">Privacy Policy</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}