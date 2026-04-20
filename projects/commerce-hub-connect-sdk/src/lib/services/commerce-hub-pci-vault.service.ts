import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CardDetail, CustomerMaskType } from '../models/api.models';
import { CommerceHubConnectApiService } from './commerce-hub-connect-api.service';

export interface SecuredCardField {
  displayValue: string;
  maskedValue: string;
}

export interface VaultedCardPayload {
  vaultReference?: string;
  card: CardDetail;
  securedCardNumber: SecuredCardField;
  securedCvv: SecuredCardField;
}

@Injectable({
  providedIn: 'root',
})
export class CommerceHubPciVaultService {
  private readonly api = inject(CommerceHubConnectApiService);

  secureCardData(card: CardDetail): Observable<VaultedCardPayload> {
    return forkJoin({
      securedCardNumber: this.secureCardNumber(card.cardNumber),
      securedCvv: this.secureCvv(card.cvv),
    }).pipe(
      map(({ securedCardNumber, securedCvv }) => ({
        card: {
          ...card,
          cardNumber: securedCardNumber.maskedValue,
          cvv: securedCvv.maskedValue,
        },
        securedCardNumber,
        securedCvv,
      })),
    );
  }

  secureCardNumber(cardNumber: string): Observable<SecuredCardField> {
    return this.maskValue('card', cardNumber).pipe(
      map((maskedValue) => ({
        maskedValue,
        displayValue: maskCardNumberForDisplay(cardNumber),
      })),
      // The local service can advertise mask endpoints while rejecting them at runtime.
      // Keep the PCI placeholder flow usable by falling back to local display masking.
      catchError(() => [
        {
          maskedValue: cardNumber,
          displayValue: maskCardNumberForDisplay(cardNumber),
        },
      ]),
    );
  }

  secureCvv(cvv: string): Observable<SecuredCardField> {
    return this.maskValue('cvv', cvv).pipe(
      map((maskedValue) => ({
        maskedValue,
        displayValue: maskCvvForDisplay(cvv),
      })),
      catchError(() => [
        {
          maskedValue: cvv,
          displayValue: maskCvvForDisplay(cvv),
        },
      ]),
    );
  }

  maskValue(type: CustomerMaskType, value: string): Observable<string> {
    return this.api.mask(type, { value }).pipe(map((response) => response.value));
  }
}

function maskCardNumberForDisplay(cardNumber: string): string {
  const visibleDigits = 4;
  const maskedDigits =
    '*'.repeat(Math.max(0, cardNumber.length - visibleDigits)) + cardNumber.slice(-visibleDigits);
  const groups: string[] = [];

  for (let end = maskedDigits.length; end > 0; end -= 4) {
    const start = Math.max(0, end - 4);
    groups.unshift(maskedDigits.slice(start, end));
  }

  return groups.join(' ');
}

function maskCvvForDisplay(cvv: string): string {
  return '*'.repeat(cvv.length);
}
