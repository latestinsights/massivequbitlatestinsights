# Deterministic Digital Twins at the Edge with FMI 3.0 Scheduled Execution

![Industrial pump connected to an edge computer and partitioned digital twin models](../images/fmi3-scheduled-execution-edge-digital-twin.jpg)

Author: concierge@massivequbit.io

A digital twin that only updates a dashboard can tolerate variable timing. A twin used for hardware-in-the-loop testing, virtual commissioning, or fast anomaly detection cannot. If one model finishes late, downstream calculations may use stale values even though every component is individually “real time.” Functional Mock-up Interface (FMI) 3.0 Scheduled Execution offers a standard way to expose model partitions and let an external scheduler decide exactly when each partition runs. That creates a credible route from engineering simulation to deterministic edge execution—but it does not make timing, safety, or interoperability automatic.

## The practical problem: model reuse without timing surprises

Industrial digital twins often combine models from different teams and tools: motor electromagnetics, pump hydraulics, controller logic, thermal behaviour, and condition monitoring. Rewriting each model for an edge target is expensive and can break traceability to the validated engineering model. Running the original tools together is also difficult because their solvers, data formats, licences, and execution assumptions differ.

FMI addresses the packaging boundary. A Functional Mock-up Unit (FMU) is a ZIP archive containing a `modelDescription.xml` file plus model code, binaries or source, and supporting resources. The standard defines C functions through which an importing runtime configures and executes the model. Blochwitz and colleagues described FMI 2.0 as a tool-independent interface for exchanging dynamic models and co-simulation components; the core benefit was a stable contract between exporters and importers rather than a universal modelling language [1].

Research also shows why the boundary is not a complete solution. Guilbaud and colleagues used FMI as a coupling framework for multi-fidelity reactor analysis and identified limitations for partial-differential-equation coupling and heterogeneous-tool restart [2]. The domain differs from manufacturing, but the engineering lesson transfers: packaging models behind a common API reduces bespoke integration, while state transfer, numerical coupling, and recovery still need explicit design.

## What Scheduled Execution changes

FMI 3.0 defines three interface types. Model Exchange gives an external solver responsibility for numerical integration. Co-Simulation usually packages a solver with each component and advances it through `fmi3DoStep`. Scheduled Execution instead exposes individual model partitions associated with FMI Clocks. The importer activates a partition with `fmi3ActivateModelPartition` at a defined simulation or wall-clock time [3].

This separation is useful for embedded and edge systems. A fast protection-related estimator might run every 10 ms, a thermal estimator every 100 ms, and a degradation calculation once per second. The FMU declares clocks and local priorities; the importer maps them into the runtime’s schedule. Triggered and aperiodic clocks can represent events rather than fixed periods. FMI 3.0 also specifies pre-emption callbacks so an FMU can protect short critical sections when a higher-priority partition interrupts a lower-priority one [3].

These are demonstrated standard capabilities, not proof that any arbitrary FMU will meet a deadline. The specification explicitly leaves cross-FMU priority resolution to the importer and does not standardise parallel execution of model partitions. It also warns that locking has overhead. Determinism therefore depends on measured worst-case execution time, bounded I/O, compatible binaries, and a scheduler with suitable real-time behaviour.

## A realistic pilot for a pump skid

The following example is hypothetical. Consider a variable-speed pump with vibration, motor-current, inlet-pressure, outlet-pressure, and temperature measurements. The operational goal is advisory detection of cavitation and bearing degradation; the twin does not close the safety loop.

Start with three partitions:

1. A 10 ms partition ingests current and vibration features and updates a simplified rotor-load state.
2. A 100 ms partition estimates hydraulic operating point from pressure and speed.
3. A 1 s partition updates thermal state and a degradation indicator.

Export these as an FMI 3.0 Scheduled Execution FMU for the target processor architecture. Keep raw waveform processing outside the FMU if it requires an accelerator or vendor library; pass bounded features through typed variables. During commissioning, run the same test vectors against the source model and the exported FMU, comparing outputs with tolerances that account for solver and floating-point differences.

The edge importer should validate `modelDescription.xml`, reject unexpected dependencies, map clocks to runtime tasks, and record the FMU version and checksum. Sensor ingestion should timestamp observations before scheduling. A late or invalid measurement should set a quality flag; it should not silently become a fresh value. Publish outputs to the plant data layer only after each activation completes successfully, with the activation time, execution duration, input-quality state, and model version attached.

Before connecting live data, replay normal operation, starts and stops, sensor dropouts, out-of-order samples, and excursions near the model boundary. Then measure execution time under realistic CPU, network, storage, and thermal load. For a 10 ms partition, using a 6 ms mean execution time is not evidence of schedulability: the relevant value is a defensible upper bound, including pre-emption and data-transfer overhead.

## Feasibility, resources, and indicative cost

The required hardware is modest for a reduced-order pump model: an industrial x86 or Arm edge computer, isolated plant-network interfaces, and existing sensors or a condition-monitoring front end. Software requirements include an FMI 3.0-capable export tool, a Scheduled Execution importer or runtime, automated FMU validation, observability, and a deployment mechanism that can roll back both model and configuration. Skills span physical modelling, controls or real-time systems, OT integration, and verification.

Here is a hypothetical pilot calculation, not a quotation or benchmark. Assume 12 engineering days for model reduction and export, 8 days for importer and data integration, 5 days for verification, and 3 days for commissioning: 28 days total. At an illustrative loaded rate of AUD 1,400 per day, labour is AUD 39,200. Add AUD 5,000 for an industrial edge computer, interfaces, and contingency, giving approximately AUD 44,200. Existing licences, new sensors, hazardous-area certification, cybersecurity review, or safety validation could materially increase that figure.

The most feasible first use is advisory monitoring or virtual commissioning, where a missed deadline can be flagged without creating an unsafe actuation. Moving the FMU into a control or protection path raises the assurance burden substantially. FMI conformance does not certify model validity, numerical stability, real-time schedulability, functional safety, or cybersecurity.

## Constraints and trade-offs

Model reduction trades fidelity for bounded execution time. A high-fidelity model may reproduce transients well but miss deadlines on the edge; an aggressively reduced model may run predictably but hide failure-relevant dynamics. Both accuracy and timing need acceptance thresholds tied to the intended decision.

Binary FMUs can create architecture, operating-system, and supply-chain constraints. Source-code FMUs may improve portability but expose intellectual property and require controlled builds. Third-party FMUs should be treated as executable software: verify provenance and hashes, scan dependencies, restrict filesystem and network access, and test failure behaviour in isolation.

Coupling remains another risk. Two individually stable models can become inaccurate when exchanged at an unsuitable rate or with hidden algebraic dependencies. The real-time co-simulation architecture presented by Scheifele, Verl, and Riedel for virtual commissioning uses partitioning, parallelisation, synchronisation, and data exchange to increase usable computing power [4]. That is evidence that model partitioning can support industrial virtual commissioning, but it is not a guarantee for a different plant, FMU, or scheduler.

Finally, FMI 3.0 Scheduled Execution support is less universal than FMI 2.0 Co-Simulation support. Confirm exporter and importer compatibility with a small FMU before committing to the architecture. If a tool only exports Co-Simulation FMUs, a deterministic pilot may still be possible, but its solver and step behaviour must be characterised separately.

## Actionable conclusions

Use FMI 3.0 Scheduled Execution when the business case depends on reusing validated model components across tools while controlling their execution order and timing. Begin with a non-safety-critical pump, drive, robot, or thermal subsystem. Define clock periods, data-quality behaviour, accuracy tolerances, and deadline criteria before choosing hardware. Validate the exported FMU against the source model, measure worst-case timing under load, and make the deployment reproducible with hashes and rollback.

The credible path is incremental: desktop replay, hardware-in-the-loop testing, shadow operation on the edge, then advisory production use. Promote the twin only when evidence supports both its physical predictions and its runtime behaviour. Scheduled Execution supplies a useful interoperability contract; engineering discipline supplies the trustworthy system.

## References

1. Blochwitz, T., Otter, M., Åkesson, J., Arnold, M., Clauß, C., Elmqvist, H., Friedrich, M., Junghanns, A., Mauß, J., Neumerkel, D., Olsson, H., and Viel, A. (2012). “Functional Mockup Interface 2.0: The Standard for Tool independent Exchange of Simulation Models.” *Proceedings of the 9th International Modelica Conference*, Linköping Electronic Conference Proceedings 76, pp. 173–184. https://doi.org/10.3384/ecp12076173. Peer-reviewed conference paper; full text available from the publisher.
2. Guilbaud, T., Fiorina, C., Lorenzi, S., Scolaro, A., Carminati, F., Maire, D., and Pautz, A. (2024). “Investigating the Functional Mock-up Interface as a Coupling Framework for the multi-fidelity analysis of nuclear reactors.” *Progress in Nuclear Energy*, 169, 105022. https://doi.org/10.1016/j.pnucene.2023.105022. Peer-reviewed journal article; full text available under CC BY 4.0.
3. Modelica Association Project FMI. (2024). *Functional Mock-up Interface Specification, Version 3.0.2*. https://fmi-standard.org/docs/3.0.2/. Authoritative technical specification; accessed 14 September 2026.
4. Scheifele, C., Verl, A., and Riedel, O. (2019). “Real-time co-simulation for the virtual commissioning of production systems.” *Procedia CIRP*, 79, pp. 397–402. https://doi.org/10.1016/j.procir.2019.02.104. Peer-reviewed conference paper.
