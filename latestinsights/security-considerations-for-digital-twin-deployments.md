# Security Considerations for Digital Twin Deployments

![Industrial turbine digital twin protected by layered cybersecurity boundaries](../images/digital-twin-security.png)

Author: concierge@massivequbit.io

> Editorial draft awaiting approval. Author: concierge@massivequbit.io. This is new article text expanding a previously published summary; the revision date will be recorded when approved.

A digital twin connects information about physical equipment to software that people use to make decisions. Some deployments also send commands back to equipment. The security design must account for both paths: misleading observations can cause poor decisions even when an attacker cannot issue a direct command.

NIST's operational technology security guidance explicitly considers performance, reliability, and safety alongside protection of systems. That context matters when a twin reaches into a production environment: controls must be evaluated against the behaviour of the physical process. [NIST SP 800-82 Revision 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final)

The following review structure is our proposed engineering checklist. It does not establish certification or replace a site-specific assessment.

## Research basis

Zemskov and colleagues examine manufacturing-twin threats across data collection, data sharing, machine learning, and system-level security. We cite their 2024 arXiv survey as a research preprint, not as a verified peer-reviewed publication or a compliance standard. This framing supports reviewing more than the network connection alone. [Zemskov et al., 2024, preprint](https://arxiv.org/abs/2412.13939)

## Draw the observation and command paths

Document where measurements originate, how they cross network boundaries, who transforms them, and where they are displayed or stored. Include maintenance laptops, integration services, deployment systems, and backup locations. These components can affect the twin even if they are absent from its main dashboard.

Draw command flows separately. A dashboard account that can inspect a model should not automatically gain permission to change equipment settings. Where control is required, identify the authorised command types, operating limits, approval rules, and the system that enforces them.

For an initial monitoring pilot, consider an observation-only integration. If control is added later, treat that as a new operational capability requiring its own review. A change in an API permission can have consequences beyond the application itself.

## Protect identity and meaning

Use distinct identities for people, devices, and integration services. Scope access to the assets and operations each identity requires. Define how credentials are issued, rotated, and revoked, including what happens when a gateway is replaced or a supplier's access ends.

Test data permissions as well as login. A service may authenticate successfully but still be able to modify an unrelated asset. Include negative tests that attempt access outside its intended scope.

Validate measurement meaning at the boundary. Check asset identity, units, timestamp plausibility, and the accepted schema. Treat unexpected changes as events to investigate. Encryption protects a connection; it does not establish that a sensor value accurately describes the process.

OPC UA PubSub distinguishes message security from transport security. Message signing and encryption concern the published payload, while transport protection depends on the mapping and can involve trust in a broker. Evaluate the protection actually configured along the complete route. [OPC UA PubSub security concepts](https://reference.opcfoundation.org/specs/OPC-10000-14/5)

## Control changes to the model

A twin's model and transformations influence what users believe about equipment. Version them alongside their deployment configuration. Record who changed a conversion, threshold, relationship, or prediction model and which tests supported the change.

Separate development experiments from production integrations. Before promoting a change, verify that it cannot accidentally write to production assets using inherited credentials. Keep a known-good version available and test how operators recognise that a rollback occurred.

For commands, distinguish request acceptance from physical completion. Record the request identity, authorisation decision, equipment acknowledgement, and observed result where available. The user interface should not declare success solely because a message entered a queue.

## Exercise recovery with operations

Choose concrete scenarios: a revoked device credential, an unavailable broker, a corrupted model configuration, or a suspected false measurement. Define who responds and what state the dashboard should show while evidence is uncertain.

Restore backups in a test environment and verify that they include the information needed to reconstruct asset relationships and access settings. Agree on which integrations remain disabled until recovery checks pass. A restored database is not necessarily a trustworthy operational model.

Finish with an evidence record: tested access boundaries, change history, recovery results, and unresolved constraints. Revisit it when the twin gains new assets or control functions. The security boundary moves when the system's operational authority changes.

## References

### Academic and research publications

1. Zemskov, A. D., et al. (2024). Security and Privacy of Digital Twins for Advanced Manufacturing: A Survey. *arXiv preprint*, 2412.13939. [DOI: 10.48550/arXiv.2412.13939](https://doi.org/10.48550/arXiv.2412.13939). Peer-review status is not established by the cited record.

### Technical and institutional sources

1. [NIST SP 800-82 Revision 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final). Accessed 2026-09-13.
2. [OPC UA PubSub security concepts](https://reference.opcfoundation.org/specs/OPC-10000-14/5). Accessed 2026-09-13.
