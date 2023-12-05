import { EmptyResponse } from '../generated/common_pb';
import { KioskLinkResponse } from '../generated/kiosksService_pb';
import { KiosksServiceClient } from '../generated/kiosksService_pb.client';
import { KiosksVM, KioskVM } from '../generated/kiosks_pb';
import { grpcTransport } from './grpc/transport';

async function get_kiosks_client() {
  return new KiosksServiceClient(grpcTransport());
}

export async function getKiosks(locationId: string): Promise<KiosksVM> {
  const client = await get_kiosks_client();
  const result = await client.getKiosks({ locationId });
  return result.response;
}

export async function getKioskQRCode(
  locationId: string,
  kioskId: string
): Promise<KioskLinkResponse> {
  const client = await get_kiosks_client();
  const result = await client.getKioskQRCode({ locationId, kioskId });
  return result.response;
}

export async function updateKiosk(
  locationId: string,
  kiosk: KioskVM
): Promise<KioskVM> {
  const client = await get_kiosks_client();
  const result = await client.updateKiosk({ locationId, kiosk });
  return result.response;
}

export async function addKiosk(
  locationId: string,
  name: string
): Promise<KioskVM> {
  const client = await get_kiosks_client();
  const result = await client.addKiosk({ locationId, name });
  return result.response;
}

export async function unlinkKiosk(
  locationId: string,
  kioskId: string
): Promise<EmptyResponse> {
  const client = await get_kiosks_client();
  const result = await client.unlinkKiosk({ locationId, kioskId });
  return result.response;
}

export async function removeKiosk(
  locationId: string,
  kioskId: string
): Promise<EmptyResponse> {
  const client = await get_kiosks_client();
  const result = await client.removeKiosk({ locationId, kioskId });
  return result.response;
}

export async function RemoteSync(locationId: string): Promise<EmptyResponse> {
  const client = await get_kiosks_client();
  const result = await client.remoteSync({ locationId });
  return result.response;
}
