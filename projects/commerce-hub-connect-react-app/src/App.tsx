import { useEffect, useState } from 'react';

import type { InteractionRequest, OtpValidateRequest } from './generated/api-models';
import type { CommerceHubAuthType } from './generated/api-models';
import { loadBrowserSdk } from './sdk-loader';
import type { CommerceHubConnectWebSdkClient } from './sdk-loader';

const initialRequest: InteractionRequest = {
  sessionReferenceId: 'react-demo-session',
  merchantTransactionId: 'txn-10001',
  merchantOrderId: 'order-20002',
  merchantInvoiceNumber: 'invoice-30003',
  email: 'merchant@example.com',
  authType: 'FINAL_SALE',
  expiryMinutes: 10,
  allowedTenderTypes: ['CARD'],
  allowEmailChange: false,
  merchantData: {
    clientId: 'laika',
    merchantId: '100014000315473',
    terminalId: '10000001',
  },
  wallet: true,
};

export default function App() {
  const [request, setRequest] = useState<InteractionRequest>(initialRequest);
  const [otp, setOtp] = useState('123456');
  const [client, setClient] = useState<CommerceHubConnectWebSdkClient | null>(null);
  const [response, setResponse] = useState('SDK not loaded yet.');

  useEffect(() => {
    loadBrowserSdk()
      .then((sdk) => setClient(sdk.createClient({ baseUrl: '/api' })))
      .catch((error) => setResponse(String(error)));
  }, []);

  async function run(label: string, work: () => Promise<unknown>) {
    try {
      const result = await work();
      setResponse(label + '\n\n' + JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(label + '\n\n' + String(error));
    }
  }

  const otpPayload: OtpValidateRequest = {
    email: request.email ?? '',
    otp,
    channel: 'EMAIL',
  };

  return (
    <main className="app-shell">
      <section className="app-panel">
        <p>React TS starter generated from the Angular wallet contract.</p>
        <div className="app-form">
          <div className="app-grid">
            <label className="app-field">
              <span>Session Reference ID</span>
              <input value={request.sessionReferenceId} onChange={(event) => setRequest((current) => ({ ...current, sessionReferenceId: event.target.value }))} />
            </label>
            <label className="app-field">
              <span>Email</span>
              <input value={request.email ?? ''} onChange={(event) => setRequest((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="app-field">
              <span>Auth Type</span>
              <input value={request.authType as CommerceHubAuthType} onChange={(event) => setRequest((current) => ({ ...current, authType: event.target.value as CommerceHubAuthType }))} />
            </label>
            <label className="app-field">
              <span>OTP</span>
              <input value={otp} onChange={(event) => setOtp(event.target.value)} />
            </label>
          </div>
          <div className="app-actions">
            <button type="button" onClick={() => client && run('createInteraction', () => client.createInteraction(request))}>Create interaction</button>
            <button type="button" onClick={() => client && run('getInteractionStatus', () => client.getInteractionStatus())}>Get interaction</button>
            <button type="button" onClick={() => client && run('sendInteractionOtp', () => client.sendInteractionOtp({ value: request.email ?? '' }))}>Send OTP</button>
            <button type="button" onClick={() => client && run('sendInteractionOtpToEmail', () => client.sendInteractionOtpToEmail({ value: request.email ?? '' }))}>Send OTP To Email</button>
            <button type="button" onClick={() => client && run('validateInteractionOtp', () => client.validateInteractionOtp(otpPayload))}>Validate OTP</button>
            <button type="button" onClick={() => client && run('getCustomerProfile', () => client.getCustomerProfile())}>Get customer profile</button>
          </div>
        </div>
      </section>

      <section className="app-panel">
        <pre className="app-json">{response}</pre>
      </section>
    </main>
  );
}
