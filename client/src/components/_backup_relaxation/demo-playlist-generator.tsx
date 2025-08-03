import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Music, Clock } from "lucide-react";

interface DemoTrack {
  title: string;
  artist: string;
  duration: number;
  mood: string;
}

const sampleTracks: DemoTrack[] = [
  { title: "Ocean Waves", artist: "Nature Sounds", duration: 300, mood: "calm" },
  { title: "Forest Rain", artist: "Ambient Nature", duration: 420, mood: "calm" },
  { title: "Meditation Bell", artist: "Zen Studios", duration: 180, mood: "focus" },
  { title: "Peaceful Piano", artist: "Classical Calm", duration: 360, mood: "healing" },
  { title: "White Noise", artist: "Sleep Sounds", duration: 600, mood: "sleep" },
  { title: "Tibetan Bowls", artist: "Sacred Sounds", duration: 480, mood: "healing" },
  { title: "Binaural Beats", artist: "Focus Labs", duration: 900, mood: "focus" },
  { title: "Garden Birds", artist: "Nature Collection", duration: 240, mood: "anxiety-relief" },
];

export default function DemoPlaylistGenerator() {
  const [selectedMood, setSelectedMood] = useState<string>("calm");
  const [generatedPlaylist, setGeneratedPlaylist] = useState<DemoTrack[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePlaylist = async () => {
    setIsGenerating(true);
    
    // Simulate API call with loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter tracks by mood and create playlist
    const moodTracks = sampleTracks.filter(track => track.mood === selectedMood);
    const shuffled = [...moodTracks].sort(() => Math.random() - 0.5);
    const playlist = shuffled.slice(0, Math.min(4, shuffled.length));
    
    setGeneratedPlaylist(playlist);
    setIsGenerating(false);
  };

  const moods = ["calm", "focus", "sleep", "anxiety-relief", "healing"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2" />
            Playlist Generator Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Your Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood)}
                    className="capitalize"
                  >
                    {mood.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={generatePlaylist}
              disabled={isGenerating}
              className="w-full bg-primary-green hover:bg-primary-green/90"
            >
              {isGenerating ? "Generating Playlist..." : "Generate Personalized Playlist"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedPlaylist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your {selectedMood.replace("-", " ")} Playlist</span>
              <Badge variant="secondary">{generatedPlaylist.length} tracks</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedPlaylist.map((track, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-slate-600">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(track.duration)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Total Duration:</span>
                  <span className="text-primary-green font-bold">
                    {formatDuration(generatedPlaylist.reduce((sum, track) => sum + track.duration, 0))}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}