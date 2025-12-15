import { Mission, DialogueLine } from './types';

export const SCENARIOS: Mission[] = [
  {
    id: 1,
    title: "The Caffeine Fix",
    level: "Beginner",
    location: "Brooklyn Café, NY",
    emoji: "☕",
    story_brief: "It's a chaotic Monday morning at the busiest cafe in Brooklyn. You need to grab a specific order for your boss before the 9 AM meeting.",
    vocab: ["Double shot", "Oat milk", "Extra hot", "To go", "On the house"],
    target_phrase: "Can I get a large oat milk latte to go?",
    bgImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
    color: "coral"
  },
  {
    id: 2,
    title: "The Local Pint",
    level: "Intermediate",
    location: "The King's Arms, London",
    emoji: "🍺",
    story_brief: "You've just joined your colleagues at a historic London pub after work. It's your turn to buy drinks, and you need to navigate the crowded bar.",
    vocab: ["It's my round", "On tap", "Last orders", "Pint of lager", "Keep the change"],
    target_phrase: "It's my round, what are you having?",
    bgImage: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=800&auto=format&fit=crop",
    color: "periwinkle"
  },
  {
    id: 3,
    title: "The Spotter",
    level: "Intermediate",
    location: "Gold's Gym, LA",
    emoji: "💪",
    story_brief: "You're at the bench press and planning to lift your personal best. You need to ask a stranger for help to ensure you don't drop the weight.",
    vocab: ["Spot me", "One more rep", "Work in", "Free weights", "Rack the weights"],
    target_phrase: "Hey bro, can you spot me on this last set?",
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    color: "mint"
  },
  {
    id: 4,
    title: "Akihabara Arcade",
    level: "Advanced",
    location: "Akihabara, Tokyo",
    emoji: "🕹️",
    story_brief: "You are deep in the neon-lit gaming district of Tokyo. You want to team up with a local player to beat the final boss.",
    vocab: ["Co-op mode", "High score", "Level up", "Game over", "Watch my back"],
    target_phrase: "Let's play co-op, I'll watch your back.",
    bgImage: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop",
    color: "periwinkle"
  },
  {
    id: 5,
    title: "The All-Nighter",
    level: "Intermediate",
    location: "University Library",
    emoji: "📚",
    story_brief: "It's 2 AM during finals week and the library is dead silent. You need to explain to a classmate why you look so stressed before the deadline.",
    vocab: ["Cramming hard", "Pulling an all-nighter", "Due date", "Burn the midnight oil", "Group study"],
    target_phrase: "I'm cramming for the final, it's due tomorrow.",
    bgImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop",
    color: "coral"
  },
  {
    id: 6,
    title: "The Elevator Pitch",
    level: "Advanced",
    location: "Silicon Valley Office",
    emoji: "💼",
    story_brief: "You've bumped into a potential investor in the hallway. You have 30 seconds to suggest a follow-up meeting without sounding desperate.",
    vocab: ["Touch base", "Circle back", "Bandwidth", "Value prop", "Deep dive"],
    target_phrase: "Let's circle back on this when you have bandwidth.",
    bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    color: "mint"
  },
  {
    id: 7,
    title: "The Manhattan Rush",
    level: "Beginner",
    location: "NYC Taxi",
    emoji: "🚕",
    story_brief: "It's 8:50 AM and pouring rain. You're stuck in gridlock on 5th Avenue. You need to direct the driver to take a shortcut and drop you off exactly at the corner before your meeting starts.",
    vocab: ["Cut across town", "Beat the traffic", "Pull over right here", "Keep the change", "Step on it"],
    target_phrase: "Can you drop me off right at the corner?",
    bgImage: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=800&auto=format&fit=crop",
    color: "coral"
  },
  {
    id: 8,
    title: "The Upgrade",
    level: "Beginner",
    location: "Grand Hotel Lobby",
    emoji: "🛎️",
    story_brief: "You've arrived exhausted at a 5-star resort. You want to politely ask if your room is ready early and if you can get a better view.",
    vocab: ["Early check-in", "Ocean view", "Reservation under", "Complimentary upgrade", "Late checkout"],
    target_phrase: "I have a reservation under Smith, is early check-in available?",
    bgImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    color: "periwinkle"
  },
  {
    id: 9,
    title: "The Remedy",
    level: "Intermediate",
    location: "24h Pharmacy",
    emoji: "💊",
    story_brief: "You woke up with a terrible sore throat before your presentation. You need to find medicine that will fix the pain without making you fall asleep.",
    vocab: ["Sore throat", "Drowsy side effects", "Over the counter", "Prescription", "Fast acting"],
    target_phrase: "Do you have anything for a sore throat that won't make me drowsy?",
    bgImage: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800&auto=format&fit=crop",
    color: "mint"
  }
];

// Helper to generate the interactive flow based on the selected mission
export const generateDialogue = (mission: Mission): DialogueLine[] => {
  // SPECIAL LOGIC FOR DAILY MISSIONS
  if (mission.isDaily) {
    return [
      {
        id: '1',
        speaker: 'News Anchor',
        text: `Breaking News: ${mission.story_brief} We're going live to our correspondent.`,
        userRole: false,
      },
      {
        id: '2',
        speaker: 'You',
        text: "Thanks, I'm here at the scene.",
        userRole: true,
      },
      {
        id: '3',
        speaker: 'News Anchor',
        text: "What's the general consensus on the ground regarding this development?",
        userRole: false,
      },
      {
        id: '4',
        speaker: 'You',
        text: mission.target_phrase,
        userRole: true,
      }
    ];
  }

  // STANDARD MISSIONS
  return [
    {
      id: '1',
      speaker: 'Coach',
      text: "Mission Briefing", // Placeholder, content handled by View
      userRole: false,
    },
    {
      id: '2',
      speaker: 'You',
      text: "I'm ready to start.",
      userRole: true,
    },
    {
      id: '3',
      speaker: 'Scenario',
      text: "Hello! How can I help you today?", 
      userRole: false,
    },
    {
      id: '4',
      speaker: 'You',
      text: mission.target_phrase,
      userRole: true,
    }
  ];
};