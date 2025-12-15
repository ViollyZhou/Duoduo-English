import { Mission } from '../types';

const TRENDING_TOPICS = [
  {
    topic: "SpaceX Starship Launch",
    brief: "SpaceX has successfully caught the Super Heavy booster on the launch tower arms. This marks a historic milestone in reusable rocketry.",
    vocab: ["Orbital velocity", "Booster separation", "Mechanical arms"],
    bg: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop",
    phrase: "The booster catch was completely unprecedented."
  },
  {
    topic: "AI Safety Summit",
    brief: "Global leaders are gathering in London to discuss the future of Artificial General Intelligence and establish new safety protocols.",
    vocab: ["Regulatory framework", "Existential risk", "Alignment"],
    bg: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    phrase: "We need a unified regulatory framework for AGI."
  },
  {
    topic: "Global Heatwave",
    brief: "Meteorologists report record-breaking temperatures across three continents simultaneously, sparking urgent climate debates.",
    vocab: ["Carbon footprint", "Renewable transition", "Tipping point"],
    bg: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=800&auto=format&fit=crop",
    phrase: "The tipping point is closer than we anticipated."
  }
];

export const fetchDailyMission = async (): Promise<Mission> => {
  // --------------------------------------------------------------------------
  // FUTURE INTEGRATION: GEMINI API & TRENDS
  // --------------------------------------------------------------------------
  // 1. Fetch Trending Topic:
  // const trends = await fetch('https://api.twitter.com/2/trends/place?id=1');
  // const topTrend = trends.data[0].name;
  //
  // 2. Generate Content with Gemini:
  // const model = ai.models.generateContent({ model: 'gemini-2.5-flash', ... });
  // const prompt = `Create a roleplay scenario based on ${topTrend}. 
  //                 Output JSON with: title, story_brief, 3 vocab words, target_phrase.`;
  // const response = await model.generateContent(prompt);
  // const data = JSON.parse(response.text);
  // --------------------------------------------------------------------------

  // MOCK LOGIC: Select topic based on date to ensure stability for 24h
  const dateIndex = new Date().getDate() % TRENDING_TOPICS.length;
  const topic = TRENDING_TOPICS[dateIndex];

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    id: 999, // Reserved ID for Daily Drop
    title: `Daily Drop: ${topic.topic}`,
    level: 'Advanced',
    location: 'Global Newsroom',
    emoji: '🔥',
    vocab: topic.vocab,
    story_brief: topic.brief,
    target_phrase: topic.phrase,
    bgImage: topic.bg,
    color: 'amber', // Special Gold Color
    isDaily: true
  };
};