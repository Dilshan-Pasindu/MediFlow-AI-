import * as signalR from '@microsoft/signalr';
import type { ConsultationEventPayload } from '../types/consultation';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5224/api';
const HUB_URL = `${apiBase.replace(/\/api\/?$/, '')}/hubs/consultation`;

class ConsultationHubService {
  private connection: signalR.HubConnection | null = null;
  private startedCallbacks: Set<(payload: ConsultationEventPayload) => void> = new Set();
  private endedCallbacks: Set<(payload: ConsultationEventPayload) => void> = new Set();
  private reconnectedCallbacks: Set<() => void> = new Set();
  private activeDoctorSubscriptions: Set<number> = new Set();
  private isStarting = false;

  private createConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('mediflow_token') || '',
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  public async startConnection(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.isStarting) {
      return;
    }

    if (!this.connection) {
      this.connection = this.createConnection();

      this.connection.on('ConsultationStarted', (payload: ConsultationEventPayload) => {
        this.startedCallbacks.forEach((cb) => {
          try { cb(payload); } catch (e) { console.error('Error in ConsultationStarted callback:', e); }
        });
      });

      this.connection.on('ConsultationEnded', (payload: ConsultationEventPayload) => {
        this.endedCallbacks.forEach((cb) => {
          try { cb(payload); } catch (e) { console.error('Error in ConsultationEnded callback:', e); }
        });
      });

      this.connection.onreconnected(async () => {
        // Resubscribe to active doctor groups if any
        for (const doctorId of this.activeDoctorSubscriptions) {
          try {
            await this.connection?.invoke('JoinDoctorQueue', doctorId);
          } catch (err) {
            console.error(`Failed to rejoin doctor queue ${doctorId} after reconnect:`, err);
          }
        }

        // Notify subscribers to synchronize with REST API
        this.reconnectedCallbacks.forEach((cb) => {
          try { cb(); } catch (e) { console.error('Error in onreconnected callback:', e); }
        });
      });
    }

    try {
      this.isStarting = true;
      await this.connection.start();
    } catch (err) {
      console.warn('SignalR ConsultationHub connection attempt failed (will auto-retry):', err);
    } finally {
      this.isStarting = false;
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      }
    }
  }

  public async joinDoctorQueue(doctorId: number): Promise<void> {
    this.activeDoctorSubscriptions.add(doctorId);
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('JoinDoctorQueue', doctorId);
      } catch (err) {
        console.error(`Failed to join doctor queue ${doctorId}:`, err);
      }
    }
  }

  public async leaveDoctorQueue(doctorId: number): Promise<void> {
    this.activeDoctorSubscriptions.delete(doctorId);
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('LeaveDoctorQueue', doctorId);
      } catch (err) {
        console.error(`Failed to leave doctor queue ${doctorId}:`, err);
      }
    }
  }

  public onConsultationStarted(callback: (payload: ConsultationEventPayload) => void): () => void {
    this.startedCallbacks.add(callback);
    return () => this.startedCallbacks.delete(callback);
  }

  public onConsultationEnded(callback: (payload: ConsultationEventPayload) => void): () => void {
    this.endedCallbacks.add(callback);
    return () => this.endedCallbacks.delete(callback);
  }

  public onReconnected(callback: () => void): () => void {
    this.reconnectedCallbacks.add(callback);
    return () => this.reconnectedCallbacks.delete(callback);
  }

  public getConnectionState(): signalR.HubConnectionState {
    return this.connection ? this.connection.state : signalR.HubConnectionState.Disconnected;
  }
}

export const consultationHubService = new ConsultationHubService();
