import { Injectable } from '@angular/core';
import { grpcTransport } from './grpc/transport';
import { KioskConfigServiceClient } from '../generated/kioskConfigService_pb.client';
import { ConceptVM } from '../generated/kioskConfig_pb';

@Injectable({
  providedIn: 'root',
})
export class ConceptsService {
  public async get_concept_client() {
    return new KioskConfigServiceClient(grpcTransport());
  }

  public async getConcepts(locationId: string) {
    const client = await this.get_concept_client();
    const result = await client.getConcepts({ locationId });

    return result.response;
  }

  public async createConcept(locationId: string, concept: ConceptVM) {
    const client = await this.get_concept_client();
    const result = await client.createConcept({ locationId, concept });

    return result.response;
  }

  public async updateConcept(locationId: string, concept: ConceptVM) {
    const client = await this.get_concept_client();
    const result = await client.updateConcept({ locationId, concept });

    return result.response;
  }

  public async removeConcept(locationId: string, id: string) {
    const client = await this.get_concept_client();
    const result = await client.removeConcept({ locationId, id });

    return result.response;
  }

  public async reorderConcepts(locationId: string, orderedIds: string[]) {
    const client = await this.get_concept_client();
    const result = await client.reorderConcepts({ locationId, orderedIds });

    return result.response;
  }
}
