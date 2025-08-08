import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput,
  Alert 
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import BLSComponent from '../components/BLSComponent';
import { useEMDRSession } from '../hooks/useEMDRSession';

interface EMDRSessionScreenProps {
  therapist: 'maria' | 'alistair';
  onBack: () => void;
}

export default function EMDRSessionScreen({ therapist, onBack }: EMDRSessionScreenProps) {
  const { 
    sessionData, 
    loading, 
    error, 
    advanceScript, 
    goBackScript, 
    completeSession, 
    pauseSession,
    saveNotes: saveSessionNotes 
  } = useEMDRSession(therapist);
  
  const [showVideo, setShowVideo] = useState(false);
  const [showBLS, setShowBLS] = useState(false);
  const [blsType, setBLSType] = useState<'visual' | 'auditory' | 'tapping'>('visual');
  const [blsSpeed, setBLSSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Preparing your EMDR session...</Text>
      </View>
    );
  }

  if (error || !sessionData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load session</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onBack}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentScript = sessionData.currentScript;

  const getScriptInfo = (script: number | string) => {
    const scripts: Record<string | number, { title: string; description: string; hasVideo: boolean; hasBLS: boolean; canPause?: boolean }> = {
      1: { title: 'Welcome & Introduction', description: 'Introduction to EMDR therapy process', hasVideo: true, hasBLS: true },
      2: { title: 'Setting up your Calm Place', description: 'Establish a safe, peaceful mental space', hasVideo: true, hasBLS: false },
      3: { title: 'Setting up the Target Memory', description: 'Identify and prepare the memory to process', hasVideo: true, hasBLS: false },
      4: { title: 'Desensitization and Reprocessing', description: 'Begin bilateral stimulation with target memory', hasVideo: true, hasBLS: true },
      5: { title: 'Reprocessing Continued', description: 'Continue processing with additional BLS', hasVideo: true, hasBLS: true, canPause: true },
      '5a': { title: 'Continue Reprocessing After an Incomplete Session', description: 'Resume reprocessing from where you left off in your previous session', hasVideo: true, hasBLS: true },
      6: { title: 'Installation of Positive Belief', description: 'Strengthen positive cognitions', hasVideo: true, hasBLS: true },
      7: { title: 'Installation of Positive Belief Continued', description: 'Reinforce positive beliefs', hasVideo: true, hasBLS: true },
      8: { title: 'Body Scan', description: 'Check for remaining physical sensations', hasVideo: true, hasBLS: false },
      9: { title: 'Calm Place Return', description: 'Return to your safe place', hasVideo: true, hasBLS: false },
      10: { title: 'Aftercare', description: 'Session closure and next steps', hasVideo: true, hasBLS: false }
    };
    return scripts[script] || scripts[1];
  };

  const handleAdvanceScript = async () => {
    if (currentScript < 10) {
      await advanceScript();
    } else {
      // Session complete
      Alert.alert(
        'Session Complete',
        'You have completed your EMDR session. Well done!',
        [{ 
          text: 'Return Home', 
          onPress: async () => {
            await completeSession();
            onBack();
          }
        }]
      );
    }
  };

  const handleBackScript = async () => {
    if (currentScript > 1) {
      await goBackScript();
    }
  };

  const handleBLSTest = (type: 'visual' | 'auditory' | 'tapping') => {
    console.log('Mobile BLS Test clicked:', type);
    setBLSType(type);
    setShowBLS(true);
  };

  const handleBLSComplete = () => {
    console.log('Mobile BLS Complete called');
    setShowBLS(false);
    Alert.alert('BLS Complete', 'How are you feeling right now? Notice any changes.');
  };

  const saveNotes = async () => {
    try {
      await saveSessionNotes(notes);
      setShowNotes(false);
      setNotes('');
      Alert.alert('Notes Saved', 'Your session notes have been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save notes.');
    }
  };

  const renderScript1 = () => (
    <View style={styles.scriptContainer}>
      <Text style={styles.scriptTitle}>🎬 Script 1: Welcome & Introduction</Text>
      <Text style={styles.scriptDescription}>
        Your therapist will guide you through an introduction to EMDR therapy and explain what to expect.
      </Text>
      
      {showVideo ? (
        <VideoPlayer
          therapist={therapist}
          scriptNumber={1}
          onVideoComplete={() => setShowVideo(false)}
          onClose={() => setShowVideo(false)}
        />
      ) : (
        <TouchableOpacity style={styles.videoButton} onPress={() => setShowVideo(true)}>
          <Text style={styles.videoButtonText}>▶️ Watch Introduction Video</Text>
        </TouchableOpacity>
      )}

      <View style={styles.blsSection}>
        <Text style={styles.sectionTitle}>🎧 BLS Testing (Use Headphones)</Text>
        <Text style={styles.blsNote}>
          Test these bilateral stimulation options before starting:
        </Text>
        
        <TouchableOpacity style={styles.blsButton} onPress={() => handleBLSTest('visual')}>
          <Text style={styles.blsButtonText}>👁️ Visual BLS Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.blsButton} onPress={() => handleBLSTest('auditory')}>
          <Text style={styles.blsButtonText}>🔊 Audio BLS Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.blsButton} onPress={() => handleBLSTest('tapping')}>
          <Text style={styles.blsButtonText}>📱 Tapping BLS Test</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.continueButton} onPress={handleAdvanceScript}>
        <Text style={styles.continueButtonText}>Continue to Calm Place Setup</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenericScript = () => {
    const scriptInfo = getScriptInfo(currentScript);
    
    return (
      <View style={styles.scriptContainer}>
        {/* Back to Previous Step - At top for all scripts except 1 */}
        {currentScript > 1 && (
          <TouchableOpacity style={styles.topBackButton} onPress={handleBackScript}>
            <Text style={styles.topBackButtonText}>← Back to Previous Step</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.scriptTitle}>🎬 Script {currentScript}: {scriptInfo.title}</Text>
        <Text style={styles.scriptDescription}>
          {scriptInfo.description}
        </Text>
        
        {scriptInfo.hasVideo && (
          showVideo ? (
            <VideoPlayer
              therapist={therapist}
              scriptNumber={currentScript}
              onVideoComplete={() => setShowVideo(false)}
              onClose={() => setShowVideo(false)}
            />
          ) : (
            <TouchableOpacity style={styles.videoButton} onPress={() => setShowVideo(true)}>
              <Text style={styles.videoButtonText}>▶️ Watch Script {currentScript} Video</Text>
            </TouchableOpacity>
          )
        )}

        {scriptInfo.hasBLS && (
          <View style={styles.blsSection}>
            <Text style={styles.sectionTitle}>BLS Options</Text>
            
            <View style={styles.blsControls}>
              <TouchableOpacity 
                style={[styles.blsButton, blsType === 'visual' && styles.activeBlsButton]} 
                onPress={() => handleBLSTest('visual')}
              >
                <Text style={styles.blsButtonText}>👁️ Visual BLS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.blsButton, blsType === 'auditory' && styles.activeBlsButton]} 
                onPress={() => handleBLSTest('auditory')}
              >
                <Text style={styles.blsButtonText}>🔊 Audio BLS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.blsButton, blsType === 'tapping' && styles.activeBlsButton]} 
                onPress={() => handleBLSTest('tapping')}
              >
                <Text style={styles.blsButtonText}>📱 Tapping BLS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Special Script 5 - Add Pause Reprocessing button */}
        {currentScript === 5 && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.pauseButton} 
              onPress={async () => {
                Alert.alert(
                  'Pause Reprocessing',
                  'This will safely pause your session and take you to your calm place.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Pause', 
                      style: 'destructive',
                      onPress: async () => await pauseSession()
                    }
                  ]
                );
              }}
            >
              <Text style={styles.pauseButtonText}>⏸️ Pause Reprocessing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.continueButton} onPress={handleAdvanceScript}>
              <Text style={styles.continueButtonText}>Finished Processing</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Special Script 5a - Return to Continued Reprocessing */}
        {currentScript === '5a' && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.continueButton} onPress={handleAdvanceScript}>
              <Text style={styles.continueButtonText}>Return to Continued Reprocessing</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Regular navigation for other scripts */}
        {currentScript !== 5 && currentScript !== '5a' && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.continueButton} onPress={handleAdvanceScript}>
              <Text style={styles.continueButtonText}>
                {currentScript === 4 && 'Continue to Start Reprocessing' || 
                 currentScript === 10 && 'Complete Session' || 
                 `Continue to Script ${typeof currentScript === 'string' ? parseInt(currentScript) + 1 : currentScript + 1}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backLink}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMDR Session</Text>
        <TouchableOpacity onPress={() => setShowNotes(true)}>
          <Text style={styles.notesLink}>Notes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {currentScript === 1 ? renderScript1() : renderGenericScript()}
      </ScrollView>

      {/* BLS Modal */}
      <Modal visible={showBLS} animationType="slide" presentationStyle="fullScreen">
        <BLSComponent
          type={blsType}
          speed={blsSpeed}
          onComplete={handleBLSComplete}
          onClose={() => {
            console.log('Mobile BLS Close button pressed');
            setShowBLS(false);
          }}
        />
      </Modal>

      {/* Notes Modal */}
      <Modal visible={showNotes} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.notesModal}>
            <Text style={styles.notesTitle}>Session Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Write your thoughts, feelings, or insights..."
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.notesButtons}>
              <TouchableOpacity style={styles.saveNotesButton} onPress={saveNotes}>
                <Text style={styles.saveNotesText}>Save Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelNotesButton} onPress={() => setShowNotes(false)}>
                <Text style={styles.cancelNotesText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#3b82f6',
  },
  backLink: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesLink: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scriptContainer: {
    padding: 20,
  },
  scriptTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  scriptDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  videoButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blsSection: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  blsNote: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  blsControls: {
    gap: 8,
  },
  blsButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeBlsButton: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  blsButtonText: {
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
  },
  navigationButtons: {
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topBackButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  topBackButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesModal: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  notesButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveNotesButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveNotesText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelNotesButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelNotesText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});