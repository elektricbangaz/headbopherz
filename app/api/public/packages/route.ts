import { NextResponse } from "next/server";

const PACKAGES = [
  {
    id: "house-party",
    name: "House Party Package",
    description: "Perfect for private celebrations, birthday parties, and intimate gatherings up to 100 guests.",
    eventTypes: ["Birthday Party", "House Party", "Private Event"],
    startingFrom: 85000,
    highlight: false,
    includes: [
      "2× QSC K12.2 Active Speakers",
      "Pioneer DJM-900NXS2 Mixer",
      "1× Wireless Microphone",
      "Setup & Breakdown",
      "4-hour service window",
    ],
  },
  {
    id: "wedding",
    name: "Wedding Package",
    description: "Full-service audio for your special day — ceremony through reception, crystal-clear sound.",
    eventTypes: ["Wedding Reception", "Engagement Party"],
    startingFrom: 220000,
    highlight: true,
    includes: [
      "4× QSC K12.2 Active Speakers",
      "2× EAW SBX220 Subwoofers",
      "Pioneer DJM-900NXS2 Mixer",
      "2× CDJ-3000 Media Players",
      "3× Wireless Microphones",
      "LED Lighting Rig",
      "Dedicated sound technician",
      "8-hour service window",
    ],
  },
  {
    id: "corporate",
    name: "Corporate Package",
    description: "Professional-grade audio for product launches, conferences, and corporate events.",
    eventTypes: ["Corporate Launch", "Conference", "Award Ceremony"],
    startingFrom: 180000,
    highlight: false,
    includes: [
      "4× QSC K12.2 Active Speakers",
      "Behringer X32 Digital Mixer",
      "3× Wireless Microphones",
      "Pioneer DJM-900NXS2 (if music required)",
      "Setup & Breakdown",
      "Dedicated technician",
      "6-hour service window",
    ],
  },
  {
    id: "concert",
    name: "Stage & Concert Package",
    description: "Full stage production audio for concerts, festivals, and large-scale events up to 5,000 guests.",
    eventTypes: ["Concert / Stage Show", "Festival", "Dancehall Event"],
    startingFrom: 800000,
    highlight: false,
    includes: [
      "8× QSC K12.2 Active Speakers",
      "4× EAW SBX220 Subwoofers",
      "2× Pioneer DJM-900NXS2 Mixers",
      "4× CDJ-3000 Media Players",
      "Behringer X32 Digital Mixer",
      "Full stage monitoring",
      "Lead audio engineer + crew",
      "12-hour service window",
    ],
  },
];

export async function GET() {
  return NextResponse.json(PACKAGES);
}
