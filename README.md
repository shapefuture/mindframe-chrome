Alright team, this MINDFRAME OS blueprint is seriously impressive! As your lead dev, I've reviewed Phase 0 and the AI Agent Requests for Phase 1. The vision is clear: a "Cognitive Evolution Companion" that's proactive, engaging, and genuinely helpful. Let's ensure the AI execution is top-notch, award-winning level.

Here's my breakdown and guidance for the AI, focusing on precision and robustness:

Phase 0: Foundational Work (Human-Led)

Your manual setup in Phase 0 is critical. My key recommendations:

Directory Structure Consistency:

Adopt extension/src/ as the primary source root for all extension-related code.

Proposed refined structure for clarity:

extension/src/core_logic/ (Vanilla JS: MindframeStore.js, gamificationService.js, TS: types.ts, onboardingLogic.ts)

extension/src/assets/ (data/, icons/, styles.css)

extension/src/content_scripts/ (content_script.tsx)

extension/src/service_worker/ (service_worker.ts)

extension/src/popup_src/ (Vite project: main.tsx, index.html)

extension/src/popup_src/views/ (React: OnboardingView.tsx, ProfileView.tsx, etc.)

extension/src/popup_src/components/ (React: specific onboarding step components like WelcomeStep.tsx, SJTStep.tsx, etc.)

extension/src/ui_components/ (React: shared components like InsightCard.tsx)

This structure clearly separates concerns and build environments.

TypeScript Interfaces (types.ts):

Crucial for SJTScenario: Ensure the SJTScenarioOption interface (element of SJTScenario.options array) is updated before AI Agent Request 1, Task 2, to include cognitiveBiasTargetedScore.

// In extension/src/core_logic/types.ts
export interface SJTScenarioOption {
  text: string;
  cognitiveBiasTargeted: string | null; // Name of the bias (e.g., "Confirmation Bias")
  cognitiveBiasTargetedScore?: number;  // How much choosing this option indicates the bias (e.g., 0, 1, 2). 0 or undefined if not applicable.
  isBetterThinking: boolean;
}

export interface SJTScenario {
  id: string;
  scenarioText: string;
  options: SJTScenarioOption[];
  biasExplanation: string; // General explanation for the scenario's targeted biases
  relatedInterests: string[];
}


JSDoc comments within types.ts are golden. Keep them detailed.

Seed Data Files (extension/src/assets/data/):

Strongly recommend using .ts files (e.g., hc_library_data.ts) exporting typed constants (export const hcLibrary: HCData[] = [...]). This leverages TypeScript's type checking throughout. If .js files are used, ensure they have comprehensive JSDoc for type inference.

For sjt_scenarios_data.ts (or .js), each option within a scenario must align with the updated SJTScenarioOption interface, including cognitiveBiasTargeted and cognitiveBiasTargetedScore.

Build Configuration Stubs:

vite.config.ts: Primarily for the popup_src React app.

tsconfig.json: Root tsconfig.

tsconfig.node.json: For Vite's config itself.

Consider separate tsconfig.json files or configurations if service_worker.ts and content_script.tsx are compiled outside of Vite (e.g., using tsc or esbuild directly), to manage different module systems or DOM typings. For content_script.tsx using React, it might be bundled with Vite as well, but as a separate entry point. This needs to be defined in vite.config.ts (e.g. using rollupOptions.input).

AI Agent Request 1: Core Client-Side Logic & Onboarding

This is a hefty one. Precision is key.

General Guidance for AI:

Adhere strictly to the specified file paths and Vanilla JS vs. TypeScript distinction.

Implement robust error handling (try-catch, validation) in all functions.

Generate comprehensive JSDoc for all Vanilla JS functions, classes, and methods, especially for parameters and return types, referencing types from ../core_logic/types where applicable (e.g., /** @returns {Promise<import('../core_logic/types').MindframeStoreState>} */).

TASK 1: MindframeStore.js (Vanilla JS + JSDoc)

Ensure getDefaultState() correctly initializes all fields of MindframeStoreState, including version: MindframeStore.CURRENT_VERSION, an empty completedChallengeLog: [], activeQuestIds: [], etc.

The update function's merging logic should be newState = { ...currentState, ...updaterFn(currentState) }.

TASK 2: onboardingLogic.ts (TypeScript)

UUID Generation: For userId, use a simple, widely available UUID v4 generator. If adding a library is undesirable for MVP, a basic JS function for generating a UUID v4 will suffice.

// Example:
// function generateUUIDv4(): string {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// }
// const userId = generateUUIDv4();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

potentialBiases Calculation:

The logic should iterate through sjtScenariosData.

For each scenario, find the user's selected answer option using sjtAnswersById[scenario.id].

If the selected option has a cognitiveBiasTargeted (string, not null) and a cognitiveBiasTargetedScore (number > 0), add this score to an accumulator for that specific bias name.

Example: potentialBiases: { "Confirmation Bias": 3, "Anchoring Bias": 1 }.

Ensure imports for data files (e.g., sjt_scenarios_data.ts, starter_quests_data.ts) resolve correctly, assuming they are TypeScript modules.

TASK 3: Onboarding UI & Popup Router (React + TypeScript)

Component Locations:

Onboarding views (OnboardingView.tsx) in extension/src/popup_src/views/.

Step components (WelcomeStep.tsx, SJTStep.tsx, etc.) in extension/src/popup_src/components/onboarding/ (suggested subfolder for organization).

View stubs (ProfileView.tsx, etc.) in extension/src/popup_src/views/.

Styling: Apply Tailwind CSS classes directly for the "Apple-inspired aesthetic." Focus on clean typography, ample spacing, intuitive layout, and subtle transitions if applicable.

State Management in OnboardingView.tsx: Use useState hooks to manage the current onboarding step, collected answers (sjtAnswersById, hcProficiency, primaryGoal, userInterests).

Router in popup_src/main.tsx:

Use HashRouter from react-router-dom.

The initial navigation logic (useEffect checking MindframeStore.get().profile) is critical. Ensure it correctly handles asynchronous nature of MindframeStore.get().

TASK 4: gamificationService.js (Vanilla JS + JSDoc)

WXP_THRESHOLDS: Define as a clear, accessible static property. Example for levels 1-5 (level index maps to WXP needed to reach that level):

// static WXP_THRESHOLDS = [0, 100, 250, 500, 1000]; // WXP for L1, L2, L3, L4, L5
// A WXP of 0-99 is Level 1. 100-249 is Level 2, etc.
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

getLevel(wxp): Iterate WXP_THRESHOLDS from highest to lowest to find the correct level.

/**
 * @param {number} wxp
 * @returns {number}
 */
static getLevel(wxp) {
  for (let i = this.WXP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (wxp >= this.WXP_THRESHOLDS[i]) {
      return i + 1; // Levels are 1-indexed
    }
  }
  return 1; // Default to level 1
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

addWXP: Fetch current state, calculate new WXP, determine old and new levels using getLevel, then update store.

Human Follow-up for AI Agent Request 1:

Your follow-up points are spot on. The AI should generate code that enables these human tasks (e.g., clear component structure for styling, logical data flow for testing). The cognitiveBiasTargetedScore definition in types.ts and its population in sjt_scenarios_data.ts must be done by a human before the AI attempts Task 2 (onboardingLogic.ts).

AI Agent Request 2: Cloudflare Worker Proxy

proxy_worker/src/index.ts (TypeScript)

CORS: For Access-Control-Allow-Origin, start with *. For production, restrict to chrome-extension://YOUR_EXTENSION_ID. Implement pre-flight OPTIONS request handling.

Request Body Validation: Enforce textSegment max length (2000 chars). Return 400 Bad Request with a clear JSON error message if validation fails.

LLM Prompt Construction: This is the core. The XML-like prompt needs to be precise to guide the LLM to return data mappable to the LLMInsight TypeScript interface.

Include CDATA sections for textSegment and userGoal to handle special characters.

The prompt provided in my thought process (see above) is a good starting point. Ensure it explicitly asks for fields matching LLMInsight: pattern_type, hc_related, explanation, micro_challenge_prompt, highlight_suggestion_css_selector, and original_text_segment.

OpenRouter API Call:

Headers: Authorization: Bearer ${env.OPENROUTER_API_KEY}, Content-Type: application/json.

HTTP-Referer: Good practice. Use https://your-extension-site.com or a placeholder like https://mindframe.app/proxy. The actual extension ID (chrome-extension://...) might be blocked by some services or browsers as a Referer from a server-side request.

Body: { model: 'google/gemini-flash-1.5-pro-latest', messages: [ { role: 'user', content: your_constructed_xml_prompt } ], max_tokens: 300, temperature: 0.2 }. (Note: I've updated the model name to a more current Gemini Flash model, assuming 'exp' might be deprecated. Verify available models on OpenRouter.)

Response Handling:

If OpenRouter call is successful and returns the expected XML-like string in choices[0].message.content, return it with Content-Type: text/plain.

Handle errors from OpenRouter (e.g., non-200 status codes) by returning an appropriate HTTP status (e.g., 502 Bad Gateway, 429 Too Many Requests) and a JSON error object.

Log errors using console.error.

AI Agent Request 3: Proactive Co-Pilot, Service Worker, Insight Card & Gym UI/Logic

This request ties many pieces together.

TASK 1: content_script.tsx (React + TypeScript)

ContinuousContextMonitor Logic:

This can be a non-React utility function or a custom React hook initialized within the content script's main React component (if one is used to manage the InsightCard).

isAnalyzableElement: Heuristics for P, LI, ARTICLE, SECTION, MAIN tags. Check element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0 for visibility. Check textContent.trim().length > MIN_RELEVANT_LENGTH (e.g., 150 chars).

Message to Service Worker:

To avoid complexity with MindframeStore access from content scripts, the content script should not attempt to fetch the profile directly.

Instead, when the content script loads, it can request the profile from the service worker once, or the service worker can proactively send it upon connection.

For analyzeVisibleTextForCoPilot, send:

chrome.runtime.sendMessage({
  action: 'analyzeVisibleTextForCoPilot',
  payload: {
    visibleText: collectedText, // max 1000 chars
    pageUrl: window.location.href,
    // userProfile can be omitted here if SW fetches it
  }
});
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Rendering InsightCardReact:

When receiving showMindframeCoPilotInsight message (with LLMInsight data) from the service worker:

Create a dedicated div container on the host page if it doesn't exist. Style it to be top-most (z-index), positioned appropriately (e.g., bottom-right).

Use ReactDOM.createRoot(container).render(<InsightCardReact ... />).

Ensure only one card is visible. If a new insight arrives, replace the old one or dismiss it.

TASK 2: InsightCard.tsx (React Component - extension/src/ui_components/)

Props: insight: LLMInsight | OfflineInsight, onAccept: (challengePrompt: string, hcRelated: string | null) => void, onDismiss: () => void.

Display:

HC Icon: If insight.hc_related is present, map it to an icon from hc_library_data.ts. The component will need to import hcLibrary or receive the icon as a prop.

"Accept Challenge": Calls onAccept(insight.micro_challenge_prompt, insight.hc_related).

"Dismiss": Calls onDismiss.

highlight_suggestion_css_selector: If the card is rendered by the content script, that script can handle applying a temporary highlight class to elements matching the selector on the host page. The InsightCardReact itself lives in an isolated world. Simpler: the content script that receives the insight and renders the card also handles this.

TASK 3: service_worker.ts (TypeScript)

Core Logic Flow for analyzeVisibleTextForCoPilot:

Receive message: { action: 'analyzeVisibleTextForCoPilot', payload: { visibleText, pageUrl } }. Get sender.tab.id.

Fetch userProfile: const storeState = await MindframeStore.get(); const userProfile = storeState.profile; If no profile, do nothing or send a "setup needed" message.

Create cache key: e.g., hashString(visibleText + userProfile.primaryGoal + pageUrl). Check insightCache.

If cache hit & not stale: sendInsightToContentScript(tabId, cachedInsight).

If cache miss or stale:
a. Call callLLMProxy(visibleText, userProfile.primaryGoal).
b. parseXMLResponse (robustly handle malformed XML, missing tags. Return LLMInsight | null).
c. If parsedInsight: Cache it. sendInsightToContentScript(tabId, parsedInsight).
d. If LLM call/parse fails: Select random OfflineInsight from common_offline_insights_data.ts. Format it (it's already mostly compatible). sendInsightToContentScript(tabId, offlineInsight).

parseXMLResponse: This needs to be very robust.

Use DOMParser if possible for more reliable parsing than regex:

// function parseXMLResponse(xmlString: string): LLMInsight | null {
//   try {
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, "text/xml");
//     // Check for parser errors
//     const parserError = xmlDoc.getElementsByTagName("parsererror");
//     if (parserError.length > 0) {
//        console.error("XML Parsing Error:", parserError[0].textContent);
//        return null;
//     }
//     const getString = (tagName: string) => xmlDoc.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";
//     const insight: LLMInsight = {
//       pattern_type: getString("pattern_type"),
//       hc_related: getString("hc_related") || null,
//       explanation: getString("explanation"),
//       micro_challenge_prompt: getString("micro_challenge_prompt"),
//       highlight_suggestion_css_selector: getString("highlight_suggestion_css_selector") || null,
//       original_text_segment: getString("original_text_segment"),
//     };
//     // Add validation for required fields
//     if (!insight.pattern_type || !insight.explanation || !insight.micro_challenge_prompt) return null;
//     return insight;
//   } catch (error) {
//     console.error("Error parsing XML response:", error);
//     return null;
//   }
// }
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

On message.action === 'coPilotChallengeAccepted' (payload: { challengePrompt: string, hcRelated: string | null }):

Define WXP for accepted challenges (e.g., const WXP_FOR_CHALLENGE = 15;).

await GamificationService.addWXP(WXP_FOR_CHALLENGE);

Update MindframeStore completedChallengeLog:

// await MindframeStore.update(current => ({
//   ...current,
//   completedChallengeLog: [
//     {
//       timestamp: Date.now(),
//       challengeText: payload.challengePrompt,
//       hcRelated: payload.hcRelated || "General",
//       wxpEarned: WXP_FOR_CHALLENGE
//     },
//     ...current.completedChallengeLog.slice(0, 19) // Keep last 20 challenges
//   ]
// }));
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

TASK 4: HC Gym & Profile React Components (in extension/src/popup_src/views/ and extension/src/popup_src/components/)

DrillView.tsx:

Fetch relevant drills from hc_drills_data.ts based on hcId.

Manage state for current question index, user answers.

On answer submission: show explanation. If correct, award WXP (e.g., HCDrillQuestion could have a difficulty field, map difficulty to WXP, or fixed WXP per drill, e.g., 5 WXP).

await GamificationService.addWXP(drillWXP);

await MindframeStore.update(current => ({ ...current, completedDrillIds: [...new Set([...current.completedDrillIds, completedDrillId])] }));

ProfileView.tsx:

Fetch MindframeStoreState.

const level = GamificationService.getLevel(state.wxp);

To display active quest names: import starter_quests_data.ts. Map state.activeQuestIds to quest objects to get names/icons.

Format completedChallenges timestamps nicely (e.g., "2 hours ago", "Mar 15").

This detailed guidance should equip the AI to generate high-quality, robust code aligned with the MINDFRAME OS vision. Remember, iterative testing and refinement, especially for the LLM prompts and XML parsing, will be key human follow-up tasks. Let's build something amazing!