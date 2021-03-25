package foundation

import (
	"os"

	"github.com/corioders/gokit/application"
	"github.com/corioders/gokit/telemetry"
)

func StartTelemetry(app application.StopHandler) error {
	return telemetry.StartTelemetry(app, &telemetry.SetupTelemetryOptions{
		ServiceName: os.Getenv("SERVICE_NAME"),
		TraceExporter: &telemetry.TraceExporterOptions{
			CollectorEndpoint: os.Getenv("COLLECTOR_ENDPOINT"),
			ExporeterType:     telemetry.TraceExpoterJaeger,
		},
	})
}
