import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CardDetail } from '../models/api.models';

export interface VaultedCardPayload {
  vaultReference?: string;
  card: CardDetail;
}

@Injectable({
  providedIn: 'root',
})
export class CommerceHubPciVaultService {
  secureCardData(card: CardDetail): Observable<VaultedCardPayload> {
    const last4 = card.cardNumber.slice(-4);

    return of({
      vaultReference: `pci-placeholder-${last4}`,
      card,
    }).pipe(delay(150));
  }
}
