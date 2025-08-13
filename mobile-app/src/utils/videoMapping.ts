// Video mapping for therapist videos stored in Supabase  
// For mobile app, we'll use the known Supabase URL directly since import.meta.env isn't available
const BASE = 'https://jxhjghgectlpgrpwpkfd.supabase.co';
type ScriptNumber = 1 | 2 | 3 | 4 | 5 | '5a' | 6 | 7 | 8 | 9 | 10;

export const getVideoSource = (therapist: 'maria' | 'alistair', scriptNumber: number | string) => {
  const videoMap: Record<'maria' | 'alistair', Record<ScriptNumber, string>> = {
    maria: {
      1: `${BASE}/storage/v1/object/public/videos//maria-script1-welcome.mp4`,
      2: `${BASE}/storage/v1/object/public/videos//maria-script2-calmplace.mp4`,
      3: `${BASE}/storage/v1/object/public/videos//maria-script3-target.mp4`,
      4: `${BASE}/storage/v1/object/public/videos//maria-script4-reprocessing.mp4`,
      5: `${BASE}/storage/v1/object/public/videos//maria-script5-reprocessing-continued.mp4`,
      '5a': `${BASE}/storage/v1/object/public/videos//maria-script5a-continue-reprocessing.mp4`,
      6: `${BASE}/storage/v1/object/public/videos//maria-script6-installation.mp4`,
      7: `${BASE}/storage/v1/object/public/videos//maria-script7-installation-continued.mp4`,
      8: `${BASE}/storage/v1/object/public/videos//maria-script8-body-scan.mp4`,
      9: `${BASE}/storage/v1/object/public/videos//maria-script9-calm-place.mp4`,
      10: `${BASE}/storage/v1/object/public/videos//maria-script10-aftercare.mp4`
    },
    alistair: {
      1: `${BASE}/storage/v1/object/public/videos//alistair-script1-welcome.mp4`,
      2: `${BASE}/storage/v1/object/public/videos//alistair-script2-calmplace.mp4`,
      3: `${BASE}/storage/v1/object/public/videos//alistair-script3-target.mp4`,
      4: `${BASE}/storage/v1/object/public/videos//alistair-script4-reprocessing.mp4`,
      5: `${BASE}/storage/v1/object/public/videos//alistair-script5-reprocessing-continued.mp4`,
      '5a': `${BASE}/storage/v1/object/public/videos//alistair-script5a-continue-reprocessing.mp4`,
      6: `${BASE}/storage/v1/object/public/videos//alistair-script6-installation.mp4`,
      7: `${BASE}/storage/v1/object/public/videos//alistair-script7-installation-continued.mp4`,
      8: `${BASE}/storage/v1/object/public/videos//alistair-script8-body-scan.mp4`,
      9: `${BASE}/storage/v1/object/public/videos//alistair-script9-calm-place.mp4`,
      10: `${BASE}/storage/v1/object/public/videos//alistair-script10-aftercare.mp4`
    }
  };

  return videoMap[therapist]?.[scriptNumber as ScriptNumber] || videoMap[therapist]?.[1];
};

export const getScriptInfo = (scriptNumber: number | string) => {
  const scripts: Record<ScriptNumber, {
    title: string;
    description: string;
    hasVideo: boolean;
    hasBLS: boolean;
    hasRatings: boolean;
  }> = {
    1: { 
      title: 'Welcome & Introduction', 
      description: 'Introduction to EMDR therapy process and what to expect',
      hasVideo: true, 
      hasBLS: true,
      hasRatings: false
    },
    2: { 
      title: 'Setting up your Calm Place', 
      description: 'Establish a safe, peaceful mental space for grounding',
      hasVideo: true, 
      hasBLS: false,
      hasRatings: false
    },
    3: { 
      title: 'Setting up the Target Memory', 
      description: 'Identify and prepare the memory to process with EMDR',
      hasVideo: true, 
      hasBLS: false,
      hasRatings: true
    },
    4: { 
      title: 'Reprocessing', 
      description: 'Begin bilateral stimulation with the target memory',
      hasVideo: true, 
      hasBLS: true,
      hasRatings: false
    },
    5: { 
      title: 'Reprocessing Continued', 
      description: 'Continue processing with additional bilateral stimulation',
      hasVideo: true, 
      hasBLS: true,
      hasRatings: false
    },
    '5a': { 
      title: 'Continue Reprocessing After an Incomplete Session', 
      description: 'Resume reprocessing from where you left off in your previous session',
      hasVideo: true, 
      hasBLS: true,
      hasRatings: false
    },
    6: { 
      title: 'Installation of Positive Belief', 
      description: 'Strengthen positive cognitions and beliefs',
      hasVideo: true, 
      hasBLS: true,
      hasRatings: true
    },
    7: { 
      title: 'Installation of Positive Belief Continued', 
      description: 'Reinforce and integrate positive beliefs',
      hasVideo: true, 
      hasBLS: true,
      hasRatings: false
    },
    8: { 
      title: 'Body Scan', 
      description: 'Check for any remaining physical sensations or disturbance',
      hasVideo: true, 
      hasBLS: false,
      hasRatings: false
    },
    9: { 
      title: 'Calm Place Return', 
      description: 'Return to your safe, calm place for closure',
      hasVideo: true, 
      hasBLS: false,
      hasRatings: false
    },
    10: { 
      title: 'Aftercare', 
      description: 'Session closure and guidance for moving forward',
      hasVideo: true, 
      hasBLS: false,
      hasRatings: false
    }
  };

  return scripts[scriptNumber as ScriptNumber] || scripts[1];
};