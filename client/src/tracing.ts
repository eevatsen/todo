import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // SigNoz OTel Collector HTTP endpoint
});

const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: 'todo-list-client',
  }),
  spanProcessors: [new BatchSpanProcessor(exporter)],
});

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      // load custom configuration for instrumentations
      '@opentelemetry/instrumentation-fetch': {
        propagateTraceHeaderCorsUrls: [
          /localhost:5001\.*/, // Propagate trace headers to our backend
        ],
      },
    }),
  ],
});

export default function initTracing() {
  console.log('OpenTelemetry Tracing Initialized');
}
