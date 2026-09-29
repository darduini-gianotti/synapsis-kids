/**
 * SaaS Manager Telemetry Tracker Client
 * 
 * Envia telemetria anônima e eventos de conversão (PLG) em lote para o SaaS Manager.
 * 100% resiliente a falhas e compatível com modo offline.
 */

export interface TelemetryEvent {
  event_name: string;
  timestamp: number;
  properties?: Record<string, any>;
}

class SaasTracker {
  private endpointUrl: string;
  private appKey: string;
  private appId = 'synapsis-kids';
  private appVersion = '1.0.0';
  private instanceId: string;
  private queue: TelemetryEvent[] = [];
  private flushTimer: number | null = null;
  private isFlushing = false;
  private maxQueueSize = 50;
  private batchFlushSize = 10;
  private flushIntervalMs = 45000; // 45 segundos

  constructor() {
    this.endpointUrl =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SAAS_TELEMETRY_URL) ||
      'https://main.d31vrxhs05asmz.amplifyapp.com/api/v1/telemetry/events';
    this.appKey =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SAAS_APP_KEY) ||
      'pk_live_synapsis_kids_7f9a12c8e3b4';

    this.instanceId = this.getOrCreateInstanceId();
    this.loadPersistedQueue();
    this.initLifecycleListeners();
  }

  private getOrCreateInstanceId(): string {
    const STORAGE_KEY = 'synapsis_saas_instance_id';
    try {
      let id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'inst_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem(STORAGE_KEY, id);
      }
      return id;
    } catch {
      return 'anon_' + Date.now();
    }
  }

  private loadPersistedQueue() {
    try {
      const saved = localStorage.getItem('synapsis_saas_event_queue');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.queue = parsed.slice(-this.maxQueueSize);
        }
      }
    } catch {
      this.queue = [];
    }
  }

  private persistQueue() {
    try {
      localStorage.setItem('synapsis_saas_event_queue', JSON.stringify(this.queue.slice(-this.maxQueueSize)));
    } catch {
      // Ignorar quota ou bloqueio de storage
    }
  }

  private detectPlatform() {
    const isPwa =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    const ua = navigator.userAgent || '';
    let os = 'Unknown';
    if (/android/i.test(ua)) os = 'Android';
    else if (/iPad|iPhone|iPod/.test(ua)) os = 'iOS';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Macintosh|Mac OS X/.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(ua);

    return {
      is_pwa: isPwa,
      os,
      screen_type: isMobile ? 'mobile' : 'desktop',
    };
  }

  private initLifecycleListeners() {
    if (typeof window === 'undefined') return;

    // Despachar eventos periódicos
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);

    // Despachar ao reconectar à internet
    window.addEventListener('online', () => {
      this.flush();
    });

    // Despachar ao sair/fechar a aba
    const handleExit = () => {
      this.flush(true);
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleExit();
      }
    });

    window.addEventListener('beforeunload', handleExit);
  }

  /**
   * Registra um evento na fila de telemetria
   */
  public track(eventName: string, properties?: Record<string, any>) {
    const event: TelemetryEvent = {
      event_name: eventName,
      timestamp: Date.now(),
      properties,
    };

    this.queue.push(event);

    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift();
    }

    this.persistQueue();

    // Se atingir o lote mínimo, dispara imediatamente
    if (this.queue.length >= this.batchFlushSize) {
      this.flush();
    }
  }

  /**
   * Envia os eventos acumulados para o SaaS Manager
   */
  public async flush(isExiting = false): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    const eventsToSend = [...this.queue];
    const payload = {
      app_id: this.appId,
      app_version: this.appVersion,
      instance_id: this.instanceId,
      platform: this.detectPlatform(),
      events: eventsToSend,
    };

    const serializedPayload = JSON.stringify(payload);

    if (isExiting && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      // Beacon não suporta headers customizados diretamente no fetch padrão sem blob em alguns browsers,
      // então usamos fetch com keepalive como primeira opção moderna
      try {
        fetch(this.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Key': this.appKey,
          },
          body: serializedPayload,
          keepalive: true,
        }).catch(() => {});
        this.queue = [];
        this.persistQueue();
        return;
      } catch {
        // Fallback silencioso
      }
    }

    this.isFlushing = true;

    try {
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': this.appKey,
        },
        body: serializedPayload,
      });

      if (response.ok || response.status === 202) {
        // Remove os eventos enviados da fila
        this.queue = this.queue.filter(
          (q) => !eventsToSend.some((sent) => sent.timestamp === q.timestamp && sent.event_name === q.event_name)
        );
        this.persistQueue();
      }
    } catch {
      // Falha silenciosa em caso de servidor offline ou sem conexão.
      // Os eventos continuam salvos na fila local para a próxima tentativa.
    } finally {
      this.isFlushing = false;
    }
  }
}

export const saasTracker = new SaasTracker();
