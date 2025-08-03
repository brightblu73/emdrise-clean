import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX, Play, Square } from "lucide-react";
import { useVoiceOver } from "@/hooks/useVoiceOver";

export default function VoiceOverSettings() {
  const {
    isEnabled,
    options,
    availableVoices,
    isSpeaking,
    toggle,
    speak,
    stop,
    updateOptions
  } = useVoiceOver();

  const testSpeech = () => {
    const testText = "This is a test of the voice-over guidance system. You can adjust the rate, pitch, and volume to your preference.";
    speak(testText);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Voice-Over Guidance</CardTitle>
        <div className="flex items-center space-x-2">
          {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <Switch
            checked={isEnabled}
            onCheckedChange={toggle}
            aria-label="Toggle voice-over guidance"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Enable audio narration for script changes, button interactions, and important updates.
        </div>

        {isEnabled && (
          <>
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label htmlFor="voice-select">Voice</Label>
              <Select
                value={options.voice || ""}
                onValueChange={(value) => updateOptions({ voice: value })}
              >
                <SelectTrigger id="voice-select">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rate Control */}
            <div className="space-y-2">
              <Label htmlFor="rate-slider">
                Speech Rate: {options.rate.toFixed(1)}x
              </Label>
              <Slider
                id="rate-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[options.rate]}
                onValueChange={([value]) => updateOptions({ rate: value })}
                className="w-full"
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <Label htmlFor="pitch-slider">
                Pitch: {options.pitch.toFixed(1)}
              </Label>
              <Slider
                id="pitch-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[options.pitch]}
                onValueChange={([value]) => updateOptions({ pitch: value })}
                className="w-full"
              />
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <Label htmlFor="volume-slider">
                Volume: {Math.round(options.volume * 100)}%
              </Label>
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={[options.volume]}
                onValueChange={([value]) => updateOptions({ volume: value })}
                className="w-full"
              />
            </div>

            {/* Test Controls */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Button
                onClick={testSpeech}
                disabled={isSpeaking}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Test Voice
              </Button>
              
              {isSpeaking && (
                <Button
                  onClick={stop}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}