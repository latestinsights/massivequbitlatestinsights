# Implementing Real-Time IoT Data Streams

![Industrial sensors streaming observations through an edge gateway to a digital twin](assets/iot-data-streams.png)

Author: concierge@massivequbit.io

> Editorial draft awaiting approval. Author: concierge@massivequbit.io. This is new article text expanding a previously published summary; the revision date will be recorded when approved.

A digital twin needs a clear account of what happened at the physical asset, when it happened, and whether the observation can be trusted. Moving messages quickly is only one part of that task. A fast pipeline can still produce an incorrect state if it mishandles duplicates, delayed measurements, or changes in units.

MQTT defines delivery quality-of-service levels, including at-least-once and exactly-once delivery at the protocol level. Those mechanisms do not remove the need to design application processing, database writes, and downstream side effects carefully. [OASIS MQTT 5.0 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html)

The design below is a proposed starting point for a monitoring application. It is not a reference implementation for safety-critical control or a guarantee of deterministic timing.

## Research basis

The review by Fuller and colleagues places IoT and data integration among the enabling technologies for digital twins. It supplies research context for connecting physical and virtual systems. The event schema, freshness target, and replay procedure below are our proposed engineering choices; they are not requirements or measured results from that review. [Fuller et al., 2020](https://doi.org/10.1109/ACCESS.2020.2998358)

## Specify a freshness requirement

Replace “real time” with a requirement tied to a decision. A maintenance dashboard and a machine interlock have different timing needs. For an illustrative monitoring pilot, the team might choose a five-second freshness target; that number is a design assumption, not an industry standard.

Measure age from the observation time, not just from the moment the backend receives a message. Record clock uncertainty when devices cannot maintain reliable time. Display a stale state when the agreed freshness window is exceeded, and define whether predictions may continue using older data.

## Agree on an event contract

A minimal measurement envelope should contain a stable asset identifier, event identifier, observation timestamp, schema version, value, unit, and quality flag. Keep receipt time as a separate backend field. If a sequence counter is used, define its scope and behaviour after a device restart.

```json
{
  "schemaVersion": 1,
  "eventId": "pump-17-session-8-1042",
  "assetId": "pump-17",
  "observedAt": "2026-09-13T02:14:00Z",
  "measurement": "temperature",
  "value": 61.2,
  "unit": "Cel",
  "quality": "good"
}
```

This example illustrates a contract rather than prescribing a universal schema. Document the accepted unit vocabulary and conversion rules. Reject incompatible types or unknown asset mappings into a reviewable quarantine; do not silently coerce every incoming value into a number.

## Separate receipt, history, and current state

Consider a pipeline with ingestion, durable event storage, validation, and a state projector. The projector turns accepted events into the current twin state. This separation makes it possible to investigate a bad transformation and replay corrected logic against stored observations.

Make each update idempotent using an event identity or another explicitly defined deduplication rule. Store late measurements in history when appropriate, but prevent them from overwriting a newer current observation. For different measurements, compare ordering within the relevant asset and measurement stream, rather than assuming one global order.

Define how corrections work. A corrected reading should identify what it supersedes, so an operator can distinguish new evidence from a duplicated message. Keep schema versions available for replay; old data should not depend on today's implicit interpretation.

## Design for disconnection and overload

Set limits for edge buffers and backend queues. Decide which data can be aggregated, which must be retained, and what the system reports when capacity is exhausted. A reconnect should not cause an uncontrolled burst that overwhelms the consumer or erases the distinction between historical and current observations.

Monitor rejected events, oldest queued event age, processing latency, and last acceptable observation per asset. A pipeline reporting only message throughput can look healthy while one important device remains silent.

## Test the awkward cases

Before rollout, replay duplicate events, reverse their arrival order, disconnect a device, restart its counter, and introduce an invalid unit. Confirm that the current state remains explainable in each case. Then repeat the test after changing the schema or projector.

Make the acceptance record understandable to the operations team: which data are fresh, which are incomplete, and how the system recovers. That record is the basis for trusting the twin's state when connectivity behaves less cleanly than it did in the demonstration.

## References

### Academic and research publications

1. Fuller, A., Fan, Z., Day, C., and Barlow, C. (2020). Digital Twin: Enabling Technologies, Challenges and Open Research. *IEEE Access*. [DOI: 10.1109/ACCESS.2020.2998358](https://doi.org/10.1109/ACCESS.2020.2998358). [Accessible author manuscript](https://arxiv.org/abs/1911.01276).

### Technical and institutional sources

1. [OASIS MQTT 5.0 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html). Accessed 2026-09-13.
