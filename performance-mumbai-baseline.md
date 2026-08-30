# Mumbai Performance Baseline

## Test details

- Deployment: `https://product-detail-app.vercel.app/`
- Test date: 2026-08-30
- Region confirmation: response header `X-Vercel-Id` began with `bom1::bom1`
- Test location: current Codex execution environment; this is not a Bangladesh-local measurement
- Method: 30 sequential HTTPS requests using `curl.exe`
- Homepage response: HTTP 200 for all 30 requests

## Homepage results

| Metric | Result |
|---|---:|
| Minimum total time | 304.5 ms |
| Average total time | 384.2 ms |
| Median (p50) | 329.0 ms |
| p95 | 698.9 ms |
| Maximum total time | 856.1 ms |
| Average time to first byte | 321.3 ms |

## Product-detail observation

- Tested `/products/P-4TCF9V` with a 15-second request timeout.
- The request timed out after receiving 27,528 bytes during the test run.
- This route result is recorded separately and should not be treated as a clean performance baseline; investigate or repeat it before comparing regions.

## Comparison instructions

After switching to Singapore, repeat the same 30-request homepage test against the same URL and record the same metrics. Compare p50, p95, maximum, and success rate. Keep the test source and timing method consistent.

## Singapore results

- Test date: 2026-08-30
- Region confirmation: response header `X-Vercel-Id` was `bom1::sin1::...`; `sin1` was the Function execution region
- Test location and method: same execution environment and 30 sequential HTTPS requests as the Mumbai test
- Homepage response: HTTP 200 for all 30 requests

| Metric | Mumbai (`bom1`) | Singapore (`sin1`) | Difference |
|---|---:|---:|---:|
| Minimum total time | 304.5 ms | 389.6 ms | +85.1 ms |
| Average total time | 384.2 ms | 480.5 ms | +96.3 ms (+25.1%) |
| Median (p50) | 329.0 ms | 450.2 ms | +121.2 ms (+36.8%) |
| p95 | 698.9 ms | 774.6 ms | +75.7 ms (+10.8%) |
| Maximum total time | 856.1 ms | 821.1 ms | -35.0 ms (-4.1%) |
| Average time to first byte | 321.3 ms | 380.1 ms | +58.8 ms (+18.3%) |

## Comparison conclusion

In this test environment, Mumbai was faster on average, median, p95, and minimum response time. Singapore had a slightly lower single-request maximum, but its typical response time was slower. Since these measurements were not taken from a Bangladesh-local network, repeat from Bangladesh before making a final production decision.
