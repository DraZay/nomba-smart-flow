# Nomba Smart Flow - Adaptive Terminal Checkout

An elite, network-resilient billing gateway and terminal checkout system built for the **DevCareer x Nomba Hackathon 2026**. This application delivers an adaptive payment flow designed to handle real-world network fluctuations gracefully while enforcing enterprise-grade cryptographic validation on the backend.

---

## 🚀 Live Production Links
* **Live Application UI:** [https://nomba-smart-flow.vercel.app](https://nomba-smart-flow.vercel.app)
* **Secure Webhook Endpoint:** `https://nomba-smart-flow.vercel.app/api/webhook`

---

## 🛠️ Core Architectural Features

### 1. Adaptive Terminal Checkout & UX Engine (Frontend)
* **Dynamic Network Simulator:** Built-in simulation control panel allowing judges to instantly test app behavior across **Stable Fiber**, **2G Fluctuation (High Latency)**, and **Total Drop (Offline Sync Mode)**.
* **Interactive Sandbox Parameter Hub:** Built-in dashboard exposing valid test credentials with an integrated **interactive clipboard system** (Click-to-Copy) for zero-friction evaluation.
* **Payload Flag Injection:** Real-time client configuration toggles (`"tokenizeCard": true`) to safely pass recurring billing context initialization variables down the wire.

### 2. Hardened Cryptographic Webhook Receiver (Backend)
* **HMAC SHA-256 Verification:** A standalone dynamic API route (`/api/webhook`) that intercepts incoming server event payloads from the Nomba gateway.
* **Timing-Attack Protection:** Implements native Node.js `crypto.timingSafeEqual` evaluation to guard against side-channel analysis and execution-time tracking.
* **Buffer-Length Guard Clause:** Hardened against malformed signature headers, enforcing strict binary buffer length alignment checks to drop fraudulent or empty packets cleanly via a `403 Forbidden` response instead of crashing the serverless container.
* **JSON Integrity Parsing:** Sandboxed parsing layers that prevent malicious or broken raw strings from disrupting the backend execution loop.

---

## 💻 Technical Tech Stack
* **Framework:** Next.js (App Router Architecture)
* **Language:** TypeScript
* **Styling Engine:** Tailwind CSS (Custom Dark/Zinc Terminal Minimalist Workspace)
* **Security & Crypto:** Node.js Native `crypto` & `Buffer` Utilities

---

## ⚙️ Environment Configurations

The application securely maps the following environment tokens to communicate seamlessly with the Nomba Sandbox Gateway (values are withheld locally to maintain strict server-side environment isolation):

```env
NEXT_PUBLIC_NOMBA_PARENT_ACCOUNT_ID=...
NEXT_PUBLIC_NOMBA_SUB_ACCOUNT_ID=...
NOMBA_TEST_CLIENT_ID=...
NOMBA_TEST_PRIVATE_KEY=...
NOMBA_LIVE_CLIENT_ID=...
NOMBA_LIVE_PRIVATE_KEY=...
NOMBA_WEBHOOK_SIGNING_KEY=...