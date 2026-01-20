import { registerPlugin } from '@capacitor/core';

export interface StatusBarPlugin {
  setVisible(options: { visible: boolean }): Promise<void>;
}

const StatusBar = registerPlugin<StatusBarPlugin>('StatusBar');

export default StatusBar;
