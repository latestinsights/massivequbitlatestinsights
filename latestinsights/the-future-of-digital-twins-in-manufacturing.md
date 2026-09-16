# The Future of Digital Twins in Manufacturing

![Robotic manufacturing line beside its luminous digital twin](assets/manufacturing-digital-twin.png)

Author: concierge@massivequbit.io

> Editorial draft awaiting approval. Author: concierge@massivequbit.io. This is new article text expanding a previously published summary; the revision date will be recorded when approved.

A manufacturing digital twin earns its place when it helps someone make a better operating decision. A detailed visual model may help explain a machine, but the business question is more specific: can the team identify a developing constraint, compare a proposed change, or understand why quality has moved outside its normal range?

NIST describes manufacturing twins as synchronized virtual models and identifies requirements, interoperability, validation, and uncertainty as central implementation challenges. Its research supports treating model credibility as part of the engineering work, rather than assuming that a live data connection makes a model trustworthy. [NIST manufacturing digital twins programme](https://www.nist.gov/programs-projects/digital-twins-advanced-manufacturing)

The following pilot approach is our proposed implementation method. It is not a reported customer deployment or a prediction of guaranteed savings.

## Research basis

Kritzinger and colleagues classify manufacturing literature by the integration of digital models, digital shadows, and digital twins. Their review highlights why the integration level should be stated explicitly rather than inferred from the label “twin.” Our recommendation is to document the actual observation and feedback paths in the pilot specification. [Kritzinger et al., 2018](https://doi.org/10.1016/j.ifacol.2018.08.474)

## Start with one decision

Consider a hypothetical packaging line whose operators regularly adjust conveyor speed. The first twin might answer: when does increasing speed create a queue at the inspection station? This is a manageable question with an identifiable decision owner and observable consequences.

Write down the operating boundary before collecting everything. Include the conveyor, inspection station, product variants, relevant buffers, and staffing assumptions. Exclude upstream processes unless their behaviour materially changes the answer. State who can act on the result and what evidence they need.

A useful pilot brief specifies the decision, the current method, the proposed improvement, and the condition that would justify stopping the experiment. If the existing production report already answers the question reliably, a more elaborate model may add little value.

## Build the minimum useful representation

Separate asset identity, observed state, and model output. A station identifier should remain stable when its sensor is replaced. Observations need timestamps, units, and quality indicators. Predictions need the model version and the assumptions that produced them.

For the packaging example, a queue estimate may initially need arrival counts, inspection cycle times, reject events, and changeover periods. A photorealistic factory model is optional. Add spatial detail only when it improves the decision, such as understanding operator travel or physical buffer capacity.

Distinguish missing data from normal operation. A disconnected counter should produce an unknown or stale state, rather than silently reporting no arrivals. Show operators when the model last received acceptable data and whether its current answer remains usable.

## Test the answer before expanding the scope

Reserve observations that were not used to tune the model. Compare predicted queues against those observations across different products and operating conditions. Investigate errors by regime: a model that performs well during steady production may fail during startup or changeover.

Agree on acceptance criteria with the decision owner. For example, the team might require that the model correctly identify the station limiting throughput during the pilot's agreed operating conditions. A numerical error threshold should come from the operational consequence of being wrong, not from a convenient chart.

Record what the model cannot represent. If staffing changes or new product geometries invalidate its assumptions, mark those conditions explicitly. A controlled refusal to provide advice is more useful than an apparently precise answer outside the tested range.

## Scale the operating practice

After a successful pilot, package the data definitions, tests, ownership, and recovery procedure with the model. A second line should reuse those foundations while validating its own operating assumptions. Reusing code does not establish that two physical processes behave alike.

Assign responsibility for sensor changes, model revisions, and operator feedback. Review rejected recommendations as well as accepted ones: repeated rejection may reveal a missing constraint that the model cannot see.

The opportunity ahead is practical: models that stay connected to operating evidence and remain understandable to the people using them. Start with a decision whose outcome can be measured, demonstrate that the model improves it, and expand only when that improvement survives normal production variation.

## References

### Academic and research publications

1. Kritzinger, W., Karner, M., Traar, G., Henjes, J., and Sihn, W. (2018). Digital Twin in manufacturing: A categorical literature review and classification. *IFAC-PapersOnLine*, 51(11), 1016–1022. [DOI: 10.1016/j.ifacol.2018.08.474](https://doi.org/10.1016/j.ifacol.2018.08.474).

### Technical and institutional sources

1. [NIST manufacturing digital twins programme](https://www.nist.gov/programs-projects/digital-twins-advanced-manufacturing). Accessed 2026-09-13.
