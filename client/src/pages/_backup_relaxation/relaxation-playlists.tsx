import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Pause, Volume2, Clock, Heart, Headphones } from "lucide-react";
import SimpleAudioPlayer from "@/components/SimpleAudioPlayer";

interface Track {
  title: string;
  artist: string;
  duration: string;
  type: 'rain' | 'ocean' | 'bells' | 'water' | 'breathing' | 'forest' | 'healing';
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  mood: string;
  color: string;
}

const predefinedPlaylists: Playlist[] = [
  {
    id: "calm",
    name: "Calm & Peaceful",
    description: "Gentle sounds to help you find inner peace and tranquility",
    mood: "calm",
    color: "bg-blue-50 border-blue-200",
    tracks: [
      {
        title: "Gentle Rain",
        artist: "Nature Sounds",
        duration: "10:00",
        type: "rain"
      },
      {
        title: "Ocean Waves",
        artist: "Peaceful Soundscapes", 
        duration: "12:00",
        type: "ocean"
      },
      {
        title: "Flowing Waters",
        artist: "Zen Collections",
        duration: "8:00",
        type: "water"
      }
    ]
  },
  {
    id: "focus",
    name: "Deep Focus",
    description: "Concentration-enhancing ambient music for mindful sessions",
    mood: "focus",
    color: "bg-green-50 border-green-200",
    tracks: [
      {
        title: "Meditative Bells",
        artist: "Mindfulness Music",
        duration: "15:00",
        type: "bells"
      },
      {
        title: "Breathing Space",
        artist: "Therapeutic Audio",
        duration: "10:00",
        type: "breathing"
      },
      {
        title: "Forest Ambience",
        artist: "Nature Therapy",
        duration: "12:00", 
        type: "forest"
      }
    ]
  },
  {
    id: "sleep",
    name: "Deep Sleep",
    description: "Soothing sounds to promote restful sleep and recovery",
    mood: "sleep",
    color: "bg-purple-50 border-purple-200",
    tracks: [
      {
        title: "Night Forest",
        artist: "Sleep Therapy",
        duration: "15:00",
        type: "forest"
      },
      {
        title: "Gentle Rain",
        artist: "Nature Sounds",
        duration: "10:00",
        type: "rain"
      },
      {
        title: "Ocean Dreams",
        artist: "Deep Sleep Collection",
        duration: "12:00",
        type: "ocean"
      }
    ]
  },
  {
    id: "anxiety-relief",
    name: "Anxiety Relief",
    description: "Calming frequencies designed to reduce stress and anxiety",
    mood: "anxiety-relief",
    color: "bg-yellow-50 border-yellow-200",
    tracks: [
      {
        title: "Breathing Space",
        artist: "Therapeutic Audio",
        duration: "8:00",
        type: "breathing"
      },
      {
        title: "Healing Waters",
        artist: "Calm Therapy",
        duration: "10:00",
        type: "water"
      },
      {
        title: "Peaceful Bells",
        artist: "Anxiety Relief",
        duration: "12:00",
        type: "bells"
      }
    ]
  },
  {
    id: "healing",
    name: "Emotional Healing", 
    description: "Supportive soundscapes for emotional processing and healing",
    mood: "healing",
    color: "bg-pink-50 border-pink-200",
    tracks: [
      {
        title: "Healing Light",
        artist: "Therapeutic Music",
        duration: "10:00",
        type: "healing"
      },
      {
        title: "Safe Harbor",
        artist: "Recovery Sounds",
        duration: "12:00",
        type: "ocean"
      },
      {
        title: "Inner Peace Bells",
        artist: "Healing Sounds",
        duration: "8:00",
        type: "bells"
      }
    ]
  }
];

export default function RelaxationPlaylists() {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const handlePlayPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrack(playlist.tracks[0]);
    setIsPlaying(true);
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.indexOf(currentTrack);
      const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
      setCurrentTrack(currentPlaylist.tracks[nextIndex]);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "calm": return "🌊";
      case "focus": return "🧘";
      case "sleep": return "🌙";
      case "anxiety-relief": return "🕊️";
      case "healing": return "💚";
      default: return "🎵";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Relaxation Playlists</h1>
          <p className="text-lg text-slate-600">
            Curated soundscapes to support your healing journey
          </p>
        </div>

        {/* Current Player */}
        {currentPlaylist && currentTrack && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Headphones className="h-6 w-6 text-primary" />
                Now Playing from "{currentPlaylist.name}"
              </h2>
              <Badge className="bg-primary text-white mt-2">
                {getMoodIcon(currentPlaylist.mood)} {currentPlaylist.mood.replace('-', ' ')}
              </Badge>
            </div>
            
            <SimpleAudioPlayer
              track={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePauseResume}
              onNext={handleNextTrack}
              className="max-w-2xl mx-auto"
            />

            <div className="text-center mt-4">
              <Badge variant="outline" className="text-sm">
                Track {currentPlaylist.tracks.indexOf(currentTrack) + 1} of {currentPlaylist.tracks.length}
              </Badge>
            </div>
          </div>
        )}

        {/* Playlist Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predefinedPlaylists.map((playlist) => (
            <Card key={playlist.id} className={`${playlist.color} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-2xl mr-2">{getMoodIcon(playlist.mood)}</span>
                    {playlist.name}
                  </span>
                  <Badge variant="outline" className="capitalize">
                    {playlist.mood.replace("-", " ")}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">
                  {playlist.description}
                </p>

                {/* Track List */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-700">Tracks ({playlist.tracks.length})</h4>
                  {playlist.tracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-white/50 rounded">
                      <div>
                        <p className="font-medium text-sm">{track.title}</p>
                        <p className="text-xs text-slate-500">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{track.duration}</span>
                        {currentTrack === track && isPlaying && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handlePlayPlaylist(playlist)}
                  className="w-full"
                  variant={currentPlaylist?.id === playlist.id ? "default" : "outline"}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {currentPlaylist?.id === playlist.id ? "Playing" : "Play Playlist"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Guidelines */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-blue-600" />
              Therapeutic Audio Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">During EMDR Sessions</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Calm & Peaceful:</strong> Pre-session preparation and grounding</li>
                  <li>• <strong>Deep Focus:</strong> Enhance concentration during setup phases</li>
                  <li>• <strong>Anxiety Relief:</strong> Support between processing rounds</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Post-Session Integration</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Emotional Healing:</strong> Process and integrate experiences</li>
                  <li>• <strong>Deep Sleep:</strong> Support recovery and memory consolidation</li>
                  <li>• <strong>Best Results:</strong> Use quality headphones in quiet space</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/70 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Volume2 className="mr-2 h-4 w-4" />
                Embedded Therapeutic Audio
              </h4>
              <p className="text-sm text-blue-700">
                Our therapeutic soundscapes are carefully crafted with scientifically-backed frequencies 
                and patterns designed to support your healing journey. Each track is optimized for 
                EMDR therapy sessions with durations of 15 minutes or less for focused therapeutic benefit.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}