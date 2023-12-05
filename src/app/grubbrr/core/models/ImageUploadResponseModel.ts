export class ImageUploadResponseModel {
  images: { [key: string]: string };
}

export class ImageUrlsResponse {
  displayUrl: string;
  storagePath: string;
}
