import { Injectable } from '@angular/core';
import { AppearanceServiceClient } from '../generated/appearanceService_pb.client';
import {
  KioskColorsVM,
  TemplateImagesVM,
  AppearanceMediaAssetVM,
  TemplateConfigVM,
  TemplateLanguageTextVM,
  TemplateSettingsVM,
  ReceiptSettingsVM,
  AnimationsVM,
  LoyaltyColorsVM,
} from '../generated/appearance_pb';
import { grpcTransport } from './grpc/transport';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private async get_appearance_client() {
    return new AppearanceServiceClient(grpcTransport());
  }

  // public async getAppearance(locationId: string) {
  //   const client = await this.get_appearance_client();
  //   const result = await client.getAppearance({ locationId });
  //   return result.response;
  // }

  public async getColors(locationId: string) {
    const client = await this.get_appearance_client();
    const result = await client.getColors({ locationId });
    return result.response;
  }

  public async updateColors(locationId: string, colors: KioskColorsVM) {
    const client = await this.get_appearance_client();
    const result = await client.upsertColors({ locationId, colors });
    return result.response;
  }

  public async getLoyaltyColors(locationId: string) {
    const client = await this.get_appearance_client();
    const result = await client.getLoyaltyColors({ locationId });
    return result.response;
  }

  public async updateLoyaltyColors(
    locationId: string,
    loyaltyColors: LoyaltyColorsVM
  ) {
    const client = await this.get_appearance_client();
    const result = await client.upsertLoyaltyColors({
      locationId,
      loyaltyColors,
    });
    return result.response;
  }

  public async getTemplateConfig(
    locationId: string
  ): Promise<TemplateConfigVM> {
    const client = await this.get_appearance_client();
    const result = await client.getTemplateConfig({ locationId });
    return result.response;
  }

  public async updateTemplateSettings(
    locationId: string,
    templateSettings: TemplateSettingsVM
  ): Promise<TemplateSettingsVM> {
    const client = await this.get_appearance_client();
    const result = await client.updateTemplateSettings({
      locationId,
      settings: templateSettings,
    });
    return result.response;
  }

  public async updateTemplateTextOverrides(
    locationId: string,
    textOverrides: TemplateLanguageTextVM
  ): Promise<TemplateLanguageTextVM> {
    const client = await this.get_appearance_client();
    const result = await client.updateTemplateTextOverrides({
      locationId,
      overrideText: textOverrides,
    });
    return result.response;
  }

  public async updateTemplateAnimations(
    locationId: string,
    animations: AnimationsVM
  ): Promise<AnimationsVM> {
    const client = await this.get_appearance_client();
    const result = await client.updateTemplateAnimations({
      locationId,
      animations,
    });
    return result.response;
  }

  public async updateTemplateImages(
    locationId: string,
    templateImages: TemplateImagesVM
  ): Promise<TemplateImagesVM> {
    const client = await this.get_appearance_client();
    const result = await client.updateTemplateImages({
      locationId,
      images: templateImages,
    });
    return result.response;
  }

  public async addScreensaver(
    locationId: string,
    screensaver: AppearanceMediaAssetVM
  ) {
    const client = await this.get_appearance_client();
    const result = await client.addScreensaver({ locationId, screensaver });
    return result.response;
  }

  public async removeScreensaver(locationId: string, screensaverId: string) {
    const client = await this.get_appearance_client();
    const result = await client.removeScreensaver({
      locationId,
      screensaverId,
    });
    return result.response;
  }

  public async getReceiptSettings(locationId: string) {
    const client = await this.get_appearance_client();
    const result = await client.getReceiptSettings({ locationId });
    return result.response;
  }

  public async updateReceiptSettings(
    locationId: string,
    settings: ReceiptSettingsVM
  ) {
    const client = await this.get_appearance_client();
    const result = await client.upsertReceiptSettings({ locationId, settings });
    return result.response;
  }
}
