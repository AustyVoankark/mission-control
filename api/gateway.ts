// OpenClaw Gateway WebSocket client

const GATEWAY_URL = 'ws://localhost:18789';

type RequestHandler = (response: any) => void;

class GatewayClient {
  private ws: WebSocket | null = null;
  private requestId = 0;
  private pendingRequests = new Map<string, RequestHandler>();
  private connected = false;
  private listeners = new Set<(event: string, payload: any) => void>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(GATEWAY_URL);
      
      this.ws.onopen = () => {
        // Wait for challenge
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle connect challenge
          if (data.type === 'event' && data.event === 'connect.challenge') {
            this.handleChallenge(data.payload);
            return;
          }
          
          // Handle response
          if (data.type === 'res') {
            const handler = this.pendingRequests.get(data.id);
            if (handler) {
              this.pendingRequests.delete(data.id);
              if (data.ok) {
                handler(data.payload);
              } else {
                handler({ error: data.error || 'Unknown error' });
              }
            }
            return;
          }
          
          // Handle events
          if (data.type === 'event') {
            this.notifyListeners(data.event, data.payload);
          }
        } catch (e) {
          console.error('Failed to parse gateway message:', e);
        }
      };
      
      this.ws.onerror = (error) => {
        reject(error);
      };
      
      this.ws.onclose = () => {
        this.connected = false;
        this.scheduleReconnect();
      };
      
      // Resolve when we get hello-ok
      const checkHello = (event: string, payload: any) => {
        if (event === 'connect' && payload?.type === 'hello-ok') {
          this.connected = true;
          resolve();
        }
      };
      this.listeners.add(checkHello);
    });
  }

  private handleChallenge(challenge: { nonce: string; ts: number }) {
    if (!this.ws) return;
    
    // Read token from window or localStorage
    const token = (window as any).OPENCLAW_GATEWAY_TOKEN || 
                  localStorage.getItem('gatewayToken') || '';
    
    const connectReq = {
      type: 'req',
      id: `connect-${Date.now()}`,
      method: 'connect',
      params: {
        minProtocol: 3,
        maxProtocol: 3,
        client: {
          id: 'openclaw-control-ui',
          version: '1.0.0',
          platform: 'web',
          mode: 'operator'
        },
        role: 'operator',
        scopes: ['operator.read', 'operator.write'],
        caps: [],
        commands: [],
        permissions: {},
        auth: { token },
        locale: 'en-US',
        userAgent: 'openclaw-mission-control/1.0.0',
        device: {
          id: 'mission-control-ui',
          nonce: challenge.nonce
        }
      }
    };
    
    this.ws.send(JSON.stringify(connectReq));
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(console.error);
    }, 5000);
  }

  private notifyListeners(event: string, payload: any) {
    this.listeners.forEach(listener => {
      try {
        listener(event, payload);
      } catch (e) {
        console.error('Listener error:', e);
      }
    });
  }

  addListener(listener: (event: string, payload: any) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async request<T>(method: string, params: any = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ws || !this.connected) {
        reject(new Error('Not connected to gateway'));
        return;
      }
      
      const id = `req-${++this.requestId}`;
      
      this.pendingRequests.set(id, (result) => {
        if (result.error) {
          reject(new Error(result.error.message || result.error));
        } else {
          resolve(result);
        }
      });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  isConnected() {
    return this.connected;
  }
}

// Singleton client
let client: GatewayClient | null = null;

export function getGatewayClient(): GatewayClient {
  if (!client) {
    client = new GatewayClient();
    client.connect().catch(console.error);
  }
  return client;
}

// Convenience methods
export async function listSessions() {
  const c = getGatewayClient();
  return c.request<any[]>('sessions.list');
}

export async function getSessionStatus(sessionKey: string) {
  const c = getGatewayClient();
  return c.request<any>('sessions.status', { sessionKey });
}

export async function gatewayStatus() {
  const c = getGatewayClient();
  return c.request<any>('gateway.status');
}

export async function gatewayRestart() {
  const c = getGatewayClient();
  return c.request<void>('gateway.restart');
}

export async function getConfig(path?: string) {
  const c = getGatewayClient();
  return c.request<any>('gateway.config.get', { path });
}

export async function patchConfig(patch: any) {
  const c = getGatewayClient();
  return c.request<void>('gateway.config.patch', { patch });
}

export async function setModel(sessionKey: string, model: string) {
  const c = getGatewayClient();
  return c.request<void>('sessions.setModel', { sessionKey, model });
}

export async function listSubagents() {
  const c = getGatewayClient();
  return c.request<any[]>('subagents.list');
}

export async function killSubagent(agentId: string) {
  const c = getGatewayClient();
  return c.request<void>('subagents.kill', { agentId });
}

export async function getSystemHealth() {
  const c = getGatewayClient();
  return c.request<any>('system.health');
}
