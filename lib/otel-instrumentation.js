'use strict'

const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const openTelemetry = require('@opentelemetry/sdk-node')

module.exports = function startTracing({ enableTracing }) {
  if (!enableTracing) {
    return
  }

  const sdk = new openTelemetry.NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  })

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start()

  return sdk
}
