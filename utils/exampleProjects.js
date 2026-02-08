// exampleProjects.js - Hardcoded few-shot examples.
// Simulates Devpost-scale pattern learning: past winners vs losers.
// Used as few-shot prompts so the LLM learns what wins at hackathons.

const EXAMPLE_PROJECTS = [
  {
    title: "SmartRecycle",
    tagline: "AI-powered recycling bin",
    description: "A smart bin that automatically sorts recyclable materials using computer vision and alerts users when something incorrect is thrown in. Uses a camera and ML model on a Raspberry Pi to distinguish plastics, paper, metal. Real hardware demo, clear impact on office recycling rates.",
    won: true
  },
  {
    title: "WeatherWear",
    tagline: "Weather reactive fashion",
    description: "A mobile app that recommends daily outfits based on the weather forecast. Uses a public weather API and simple rules to suggest clothing. Straightforward idea, modest innovation, mostly UI polish.",
    won: false
  },
  {
    title: "FarmAI",
    tagline: "Smart farming assistant",
    description: "Platform that uses AI to analyze soil data and drone imagery for crop health and yield predictions. ML for irrigation and fertilizer optimization. Clear agricultural need, strong technical solution, real data integration.",
    won: true
  },
  {
    title: "ChatDonate",
    tagline: "Charity chatbot",
    description: "Chatbot in messaging apps that suggests charitable donations during conversations. Promotes social good but lacks unique technical innovation. Unclear incentive for adoption. Feels like a wrapper.",
    won: false
  },
  {
    title: "CodeScribe",
    tagline: "Voice-to-code for devs",
    description: "Real-time voice commands that generate and refactor code. Integrates with VS Code, supports multiple languages. Solves a concrete pain point for developers. Demo showed live coding with voice. Impressive polish.",
    won: true
  },
  {
    title: "TodoGPT",
    tagline: "AI todo list",
    description: "A todo app that uses ChatGPT to organize your tasks. Basically a chat interface hooked to the OpenAI API. No novel tech. Hundreds of similar projects exist.",
    won: false
  }
];

function getExampleProjects() {
  return EXAMPLE_PROJECTS;
}

module.exports = { getExampleProjects, EXAMPLE_PROJECTS };
