import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
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
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Menu, User, LogOut, TrendingUp, Brain, Shield, CreditCard, Scale, FileText, Eye, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Navigation() {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      refetchUser();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    },
  });

  const navItems = [
    { href: "/", label: "Home", icon: Brain },
    { href: "/emdr-session", label: "Therapy Session", icon: Heart },
    { href: "/resources", label: "EMDR Resources", icon: Shield },
    { href: "/progress", label: "Progress", icon: TrendingUp },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
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

                    <Link href="/progress">
                      <DropdownMenuItem>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Progress
                      </DropdownMenuItem>
                    </Link>

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
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
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
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <div className="flex flex-col min-h-full">
                  {/* Mobile Logo */}
                  <Link href="/" className="flex items-center space-x-2 mb-8">
                    <Logo variant="mobile" />
                  </Link>

                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                        <p className="font-medium text-slate-800">{user.username}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        {user.subscriptionStatus === 'trial' && (
                          <Badge variant="secondary" className="mt-2">
                            Trial: {user.trialEndsAt ? 
                              Math.ceil((new Date(user.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                              : 0} days left
                          </Badge>
                        )}
                        {user.subscriptionStatus === 'active' && (
                          <Badge variant="default" className="mt-2 bg-primary-green">
                            Premium
                          </Badge>
                        )}
                      </div>

                      {/* Navigation Links */}
                      <div className="flex-1 space-y-2 overflow-y-auto pb-4">
                        {navItems.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <Button 
                              variant="ghost" 
                              className={`w-full justify-start ${isActive(item.href) ? 'text-primary bg-primary/10' : 'text-slate-700'}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className="h-4 w-4 mr-2" />
                              {item.label}
                            </Button>
                          </Link>
                        ))}

                        {/* Contact Section in Mobile */}
                        <a href="mailto:support@emdrise.com">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-slate-700"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </a>

                        {/* Legal Section in Mobile */}
                        <div className="pt-4">
                          <p className="text-sm font-medium text-slate-500 mb-2 px-3">Legal</p>
                          <Link href="/terms-of-use">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-slate-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Terms of Use
                            </Button>
                          </Link>
                          <Link href="/privacy-policy">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-slate-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Privacy Policy
                            </Button>
                          </Link>
                        </div>

                      </div>

                      {/* Logout */}
                      <div className="mt-auto pt-4 border-t border-slate-200">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-slate-700"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth">
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </Button>
                      </Link>
                    </div>
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