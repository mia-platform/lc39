'use strict'

const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const openTelemetry = require('@opentelemetry/sdk-node')

module.exports = function startTracing({ enableTracing }) {
  if (!enableTracing) {
    // Setting this env var, it is possible to disable the tracing sdk. Link:
    // https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-sdk-node#disable-the-sdk-from-the-environment
    // This configuration does not overwrite the env variable if already configured.
    if (!process.env.OTEL_SDK_DISABLED) {
      process.env.OTEL_SDK_DISABLED = 'true'
    }
  }


  const sdk = new openTelemetry.NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  })

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start()

  return sdk
}
