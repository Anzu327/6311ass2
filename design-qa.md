# Terminal scanner design QA

Source visual truth: selected third displayed ImageGen result exec-ac229e89-2199-4b09-a50a-00f09bd2143c.png (984x1598). Existing app remains cloud-edited; no framework replacement. Comparator CSS viewport390x634 aligns the actual selected-image aspect, rather than stretching it to a different phone ratio. Also check320x568,390x844and1366x768 responsive scanner/completion/recovery.

Implementation screenshot: pending browser-run qa-results/terminal-design-390x634.png, active scan test-only62%state. Production uses real camera, no supplied mock face. Camera/photo content is dynamic; compare layout/type/tokens/assets not identity.

Required fidelity surfaces: fonts (officialOFLAnton + existingScanSans), spacing/layout, charcoal/bone/blue/orange palette, generated texture/corners/ruler + supplied brand mark/blue beam, scan/status/result/recovery copy.

Findings: browser capture and combined reference comparison pending. No completion claim.

Implementation checklist: pass runtime checks, capture/inspectsame-state reference comparison and focused type/progress/camera regions; fixP0/P1/P2; verifyall4group endings, nofaceloss resets,denial/skip, reduced motion, continuousswipes/messages remain; inspectconsole/missingassets.

final result: blocked


Comparison history — iteration1 blocked:
Combined full/header/controls images saved under outputs/scanner-terminal/comparison-*.png from actual QA_CURRENT_IMAGE in workflow37754936579. Active implementation74% versus reference62%; progress timing and test-face placement not a production classification claim. [P1]displayglyphcaps too tall versus source andSCANstarts about12–18pxtoo far right. Fix: source-matching OswaldBold instead ofAnton, measuredSCANfont76pxbbox167x64vsoldAnton92bbox177x81, keep title-rowheightandbleedwarning18pxleft. [P2]percentage/controlsizes too large/compactheightbreakpoint changes390x634layout. Fix: percent17cqw, compactrulesonlywidth350/height580. [P2]generatedgrayouterframe doubled/thick. Fix: regeneratedonlycornersv2 plusstandard1pxcameraUIborder. QA-onlycenteredfixtureandtimer-pollingfreeze normalize62%/beamphase for same-state capture; production2sgate/camera remains untouched. Re-capture pending; final result remains blocked.
