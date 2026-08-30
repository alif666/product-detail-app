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
