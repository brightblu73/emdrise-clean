import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";

interface DrCareyAvatarProps {
  isActive?: boolean;
  showControls?: boolean;
}

export default function DrCareyAvatar({ isActive = true, showControls = true }: DrCareyAvatarProps) {
  return (
    <Card className="therapeutic-card sticky top-24">
      <CardContent className="p-6">
        <div className="text-center">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
            alt="therapist, professional female therapist with shoulder-length hair and glasses" 
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20"
          />
          
          <h3 className="font-semibold text-slate-800 mb-1">therapist</h3>
          <p className="text-sm text-slate-600 mb-4">Your EMDR Guide</p>
          
          {isActive && (
            <Badge className="bg-primary-green text-white mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs">Guiding You</span>
              </div>
            </Badge>
          )}
          
          {showControls && (
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-primary border-primary hover:bg-primary hover:text-white"
              >
                <Volume2 className="h-3 w-3 mr-2" />
                Audio Guide
              </Button>
              
              <p className="text-xs text-slate-500">
                Professional EMDR therapy guidance with warmth and expertise
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
