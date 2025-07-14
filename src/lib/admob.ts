import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export interface AdMobConfig {
  appId: string;
  publisherId: string;
  homeScreenAdUnitId: string;
}

export const admobConfig: AdMobConfig = {
  appId: 'fykeca-app-pub-5077054658375352~4528761112',
  publisherId: 'pub-5077054658375352',
  homeScreenAdUnitId: 'ca-app-pub-5077054658375352/1080470694',
};

export class AdMobService {
  private static instance: AdMobService;
  private initialized = false;

  static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['YOUR_TESTING_DEVICE_ID'],
        initializeForTesting: true,
      });
      this.initialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  async showBannerAd(adId: string = admobConfig.homeScreenAdUnitId): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Running in web mode, banner ad simulation');
      return;
    }

    try {
      await AdMob.showBanner({
        adId,
        adSize: 'BANNER',
        position: 'BOTTOM_CENTER',
        margin: 0,
      });
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  async hideBannerAd(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  }

  async showInterstitialAd(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Running in web mode, interstitial ad simulation');
      return;
    }

    try {
      await AdMob.prepareInterstitial({
        adId: admobConfig.homeScreenAdUnitId,
      });
      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  }
}

export const admobService = AdMobService.getInstance();