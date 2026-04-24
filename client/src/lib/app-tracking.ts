import { Capacitor } from '@capacitor/core';
import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency';

export type TrackingStatus =
  | 'authorized'
  | 'denied'
  | 'notDetermined'
  | 'restricted'
  | 'unknown';

export interface TrackingResponse {
  status: TrackingStatus;
  message?: string;
}

/**
 * Requests App Tracking Transparency permission on iOS
 * This should be called after the app has launched
 */
export async function requestTrackingPermission(): Promise<TrackingResponse> {
  try {
    // Only request permission on iOS
    if (Capacitor.getPlatform() !== 'ios') {
      return {
        status: 'unknown',
        message: 'App Tracking Transparency is only required on iOS'
      };
    }

    // Check current tracking status
    const { status: currentStatus } = await AppTrackingTransparency.getStatus();

    // If already authorized or denied, return current status
    if (currentStatus === 'authorized' || currentStatus === 'denied' || currentStatus === 'restricted') {
      return {
        status: currentStatus as TrackingStatus,
        message: `Tracking permission already ${currentStatus}`
      };
    }

    // Request permission if not determined
    if (currentStatus === 'notDetermined') {
      const { status } = await AppTrackingTransparency.requestPermission();
      return {
        status: status as TrackingStatus,
        message: `Tracking permission ${status === 'authorized' ? 'granted' : 'denied'}`
      };
    }

    return {
      status: currentStatus as TrackingStatus,
      message: `Unexpected tracking status: ${currentStatus}`
    };

  } catch (error) {
    console.error('Error requesting tracking permission:', error);
    return {
      status: 'unknown',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Gets the current App Tracking Transparency status
 */
export async function getTrackingStatus(): Promise<TrackingStatus> {
  try {
    if (Capacitor.getPlatform() !== 'ios') {
      return 'unknown';
    }

    const { status } = await AppTrackingTransparency.getStatus();
    return status as TrackingStatus;
  } catch (error) {
    console.error('Error getting tracking status:', error);
    return 'unknown';
  }
}
