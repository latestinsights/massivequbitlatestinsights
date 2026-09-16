# Semantic HVAC Twins: Portable Retrofit Analytics with Brick and BACnet

![Commercial HVAC plant, edge gateway and knowledge graph connected to a mirrored building digital twin](assets/semantic-hvac-twin-brick-bacnet.jpg)

Author: concierge@massivequbit.io

A retrofit digital twin can receive thousands of BACnet values and still misunderstand the building. The missing layer is often semantics: which point is a supply-air temperature, which air-handling unit it belongs to, which zone that unit serves, and whether a value is a sensor reading, command, or setpoint. A practical semantic twin adds a validated knowledge graph between legacy building automation and analytics. Brick provides an open building ontology for that graph; BACnet remains the operational protocol. The result can make fault detection, energy analysis, and supervisory applications more portable, but only when engineers verify mappings, control authority, and data quality.

## The retrofit problem is meaning, not transport

BACnet standardizes messages and objects used to exchange building-automation data. It is intentionally broader than any one vendor, and ANSI/ASHRAE Standard 135-2024 is the current published revision [1]. Yet two contractors can expose equivalent HVAC functions with different object names, descriptions, units, and equipment hierarchies. A point called `SAT`, `AHU1_SA_T`, or `AI-17` may represent the same physical concept—or not.

That ambiguity makes portfolio analytics expensive. Each deployment accumulates handwritten point lists and site-specific rules. A fault-detection routine that expects a supply-air temperature, outdoor-air temperature, fan status, and cooling-valve command cannot safely infer those inputs from strings alone.

Brick addresses a different layer from BACnet. It represents building entities and relationships as a machine-queryable graph: an air-temperature sensor can be declared a point of an air-handling unit, while that unit feeds a zone. Brick's official documentation describes physical, logical, and virtual assets using an extensible vocabulary and relationships [2]. Balaji and colleagues evaluated this approach across six buildings and 89 applications, arguing that a common schema can support portable smart-building applications without reducing every site to identical hardware [3].

## What the semantic twin contains

The twin needs three connected planes:

1. **Operational plane.** BACnet/IP or BACnet/SC exposes current values, commands, units, status flags, and device identities. An edge connector polls or subscribes at rates appropriate to each point and preserves the device timestamp and quality state.
2. **Semantic plane.** An RDF graph assigns stable identifiers to equipment, points, spaces, meters, and relationships. Brick classes describe what an entity is; relationships describe how entities are connected. The graph stores references to BACnet objects rather than copying control logic.
3. **Application plane.** Analytics discover inputs by graph query, then read time-series values through a separate service. The same application can ask for all variable-air-volume boxes fed by a selected air-handling unit instead of relying on a site-specific spreadsheet.

RDF and SPARQL make the graph queryable; SHACL can express structural constraints and produce validation results. SHACL became a W3C Recommendation in 2017 [4]. Fierro and colleagues demonstrated how Brick models can use SHACL shapes to detect incorrect or non-idiomatic ontology use, including missing types and invalid relationships [5]. Validation does not prove that a field technician mapped the correct physical sensor, but it can reject structurally impossible or incomplete models before analytics rely on them.

The emerging ASHRAE 223P work follows a related standards-based direction. The U.S. Department of Energy describes it as a semantic model for building monitoring and control applications based on RDF, SPARQL, and SHACL, with templates and compliance checking under development [6]. It should therefore be treated as an evolving interoperability target, not as a finished retrofit product.

## A realistic staged implementation

Consider a hypothetical three-storey office with one chilled-water air-handling unit and 24 VAV boxes. The immediate objective is to identify simultaneous heating and cooling, stuck dampers, and zones with persistent comfort deviation. The first release is advisory: it cannot write to controllers.

Start with a read-only BACnet inventory. Capture device instance, object type and instance, name, description, engineering units, present value, reliability, and update behaviour. Export controller backups separately; network discovery is not a substitute for configuration evidence. Reconcile the inventory with mechanical drawings, control schematics, and a physical walk-down.

Next, create stable equipment and point identifiers. Map only the minimum set required by the first use cases: outdoor-air temperature; AHU supply and return temperatures; fan status and speed command; valve commands; VAV airflow, setpoint, damper command, zone temperature, and heating-valve command. Record mapping confidence and evidence. Ambiguous points remain quarantined rather than guessed.

Build graph constraints for the application contract. For example, every modeled VAV must have a zone-temperature sensor, an airflow sensor or estimate, and a damper command; every AHU must have a supply-air temperature. Run SHACL validation in continuous integration for graph changes. Then replay historical telemetry against the discovery queries. A portable rule should receive the same functional inputs when identifiers change but the graph relationships remain equivalent.

Only after shadow testing should the service run continuously at the edge. Publish detected conditions with the source-point quality, rule version, graph version, and evidence window. Operators need traceability from an alarm back to raw values and mapped equipment. If later phases add supervisory commands, place them behind an independently reviewed allowlist, rate limits, operating envelopes, manual override, and controller-side safeties.

## Feasibility, resources, and indicative cost

The hardware requirement is usually modest: an industrial or enterprise edge computer with two segregated network interfaces, durable storage, and backup power. Existing BACnet infrastructure can remain in place. Additional sensors may be required where the BMS lacks reliable airflow, valve position, electrical power, or environmental measurements.

The software stack needs a BACnet connector, time-series store, RDF graph store, Brick vocabulary, SHACL validator, query API, observability, and version-controlled mapping pipeline. Required skills include HVAC controls, BACnet networking, semantic modeling, data engineering, cybersecurity, and commissioning. The scarce skill is often the person who can reconcile controls documentation with what the plant actually does.

The following estimate is hypothetical, not a market quotation. Assume 5 days for inventory and network review, 8 days for equipment/point verification, 7 days for graph creation and validation, 8 days for two analytics, and 4 days for shadow commissioning: 32 engineering days. At an illustrative loaded rate of AUD 1,400 per day, labour is `32 × 1,400 = AUD 44,800`. Add AUD 4,000 for an edge computer, networking, and contingency, producing an indicative pilot total of AUD 48,800. New sensors, BACnet/SC infrastructure, hazardous-area requirements, after-hours access, or remediation of undocumented controls would add cost.

## Limitations, security, and privacy

Semantic portability has boundaries. Brick can state that a point is a supply-air temperature sensor; it cannot establish calibration, correct placement, or live accuracy. Graph completeness also depends on the intended application. A model sufficient for an energy rule may be inadequate for control or indoor-air-quality assurance.

BACnet access crosses an operational-technology trust boundary. Use read-only credentials or network controls for the pilot, restrict the connector to required devices and objects, encrypt supported links, log queries and writes, and separate remote administration from controller traffic. Treat graph changes as code: review them, sign releases, retain hashes, and support rollback. Never allow an analytics service to discover write authority merely because a writable BACnet object exists.

Occupancy, access-control, and fine-grained zone data can reveal patterns about people. Minimize collection, prefer equipment-level signals where possible, aggregate before export, define retention, and apply role-based access. The semantic graph itself may expose sensitive floor layouts and critical equipment relationships, so it requires access control even when it contains no live telemetry.

There are operational trade-offs. Manual verification improves trust but raises onboarding cost. Automated classification can accelerate mapping, but low-confidence results require human review. A detailed graph supports more applications but is harder to maintain. Cloud graph services simplify central management; an edge-resident graph reduces dependence on external connectivity. Versioned interfaces between graph, telemetry, and applications are more important than selecting a fashionable database.

## Actionable conclusion

A useful HVAC digital twin begins with a narrow application contract, not a complete virtual building. Keep BACnet as the plant communication layer and add a validated semantic layer that explains the equipment, points, and relationships applications need. Pilot one AHU and its VAVs, verify every required mapping, validate the graph, replay historical data, and operate read-only in shadow mode.

The measurable outcome is not the number of modeled points. It is whether the same analytics can be deployed to a second comparable system with fewer custom mappings, while preserving traceability and safe operations. Brick and semantic-web standards provide credible building blocks for that outcome; commissioning evidence and lifecycle governance determine whether the twin remains trustworthy.

## References

1. ASHRAE. (2024). *ANSI/ASHRAE Standard 135-2024, BACnet—A Data Communication Protocol for Building Automation and Control Networks*. https://bacnet.org/news/ansi-ashrae-135-2024-now-published/. Official standards publication notice; accessed 17 September 2026.
2. Brick Consortium. (2026). *Brick: A Uniform Metadata Schema for Buildings*. https://brickschema.org/. Official project documentation; accessed 17 September 2026.
3. Balaji, B., Bhattacharya, A., Fierro, G., Gao, J., Gluck, J., Hong, D., Johansen, A., Koh, J., Ploennigs, J., Agarwal, Y., Bergés, M., Culler, D., Gupta, R., Kjærgaard, M. B., Srivastava, M., and Whitehouse, K. (2018). “Brick: Metadata schema for portable smart building applications.” *Applied Energy*, 226, 1273–1292. https://doi.org/10.1016/j.apenergy.2018.02.091. Peer-reviewed journal article; author-posted full text reviewed.
4. W3C. (2017). *Shapes Constraint Language (SHACL)*. https://www.w3.org/TR/shacl/. W3C Recommendation; accessed 17 September 2026.
5. Fierro, G., Koh, J., Nagare, S., Zang, X., Agarwal, Y., Gupta, R. K., and Culler, D. E. (2020). “Formalizing Tag-Based Metadata With the Brick Ontology.” *Frontiers in Built Environment*, 6, 558034. https://doi.org/10.3389/fbuil.2020.558034. Peer-reviewed open-access journal article; full text reviewed under CC BY 4.0.
6. U.S. Department of Energy. (2026). *ASHRAE Standard 223P*. https://www.energy.gov/cmei/buildings/ashrae-standard-223p. Official institutional project page; accessed 17 September 2026.
