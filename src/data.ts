export interface Choice {
  id: string;
  text: string;
  intent: string;
  impact: number; // 1-10
  feedback: string;
  coachTip: string;
  rating: 'MASTER' | 'AVERAGE' | 'POOR';
}

export interface Scenario {
  id: string;
  title: string;
  customerName: string;
  customerTitle: string;
  company: string;
  objection: string;
  context: string;
  mentorTip: string;
  choices: Choice[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "case-1",
    title: "The Price Gap Reframing",
    customerName: "Dr. Tariq Al-Omari",
    customerTitle: "Chief Surgical Resident",
    company: "King Faisal Specialist Hospital",
    objection: "The monthly rent is 15,000 SAR higher than the competition nearby. It's simply too much for the same square footage.",
    context: "Dr. Tariq values proximity and security but is fixated on the sticker price of the Lagoon Villa.",
    mentorTip: "Focus on TCO (Total Cost of Ownership). Include hidden costs like maintenance, gym memberships, and commute time value.",
    choices: [
      {
        id: "1a",
        text: "I understand the price is high. Would a 10% discount help us close this deal today?",
        intent: "Discounting (Low Margin Defense)",
        impact: 3,
        rating: 'POOR',
        feedback: "Direct discounting erodes our brand value and margin without addressing the customer's actual concern about value.",
        coachTip: "Avoid leading with price cuts. Use the LAER framework to explore why they feel the price is high first."
      },
      {
        id: "1b",
        text: "I hear you. However, our model covers fiber, maintenance, and gym—costs you'd pay elsewhere.",
        intent: "TCO Reframing (Value Defense)",
        impact: 8,
        rating: 'AVERAGE',
        feedback: "Good use of TCO reframing. You're listing tangible benefits that offset the higher base rent price.",
        coachTip: "This is a solid 'Respond' phase, but ensure you've 'Explored' enough to know which of these benefits matters most to him."
      },
      {
        id: "1c",
        text: "We are the most luxury option in Al Munsyah. Our high-profile residents justify this premium.",
        intent: "Prestige Selling",
        impact: 5,
        rating: 'AVERAGE',
        feedback: "Prestige matters to Dr. Tariq, but this response can come off as arrogant if not paired with specific lifestyle outcomes.",
        coachTip: "Luxury isn't just about 'who' lives here, it's about the friction-less life we provide for busy professionals."
      },
      {
        id: "1d",
        text: "Let's explore your expenses. Beyond rent, what are you spending on utilities and security now?",
        intent: "LAER - Explore Phase",
        impact: 10,
        rating: 'MASTER',
        feedback: "Masterful. By asking him to quantify his current hidden costs, you allow him to discover the value gap himself.",
        coachTip: "The best negotiations feel like collaborative problem-solving. This exploration builds trust and justifies the price."
      }
    ]
  },
  {
    id: "case-2",
    title: "The Inaction Stalemate",
    customerName: "Sarah Jenkins",
    customerTitle: "Regional Tech Director",
    company: "Global Systems Inc.",
    objection: "The duplex is perfect, but my current lease has 4 months left. It's safer to wait until next quarter.",
    context: "Sarah is risk-averse and fears double-paying rent, even though the modern duplex units are in high demand.",
    mentorTip: "Highlight the 'Cost of Inaction' and the risk of losing the preferred unit/floor plan.",
    choices: [
      {
        id: "2a",
        text: "I understand. I'll follow up with you in 3 months to check our current availability.",
        intent: "Passive Acceptance",
        impact: 2,
        rating: 'POOR',
        feedback: "Passive acceptance loses momentum. In 3 months, Sarah may have found another reason not to move.",
        coachTip: "Never leave a lead cold. Address the root of the 'safety' concern she mentioned."
      },
      {
        id: "2b",
        text: "If you wait, these park view units will likely be gone. We are at 92% occupancy.",
        intent: "Urgency/Scarcity",
        impact: 7,
        rating: 'AVERAGE',
        feedback: "Using scarcity is a valid tactic for a director who values data, but it might feel like pressure if used too early.",
        coachTip: "Urgency works best when it's framed as 'protecting her interest' rather than 'closing a sale'."
      },
      {
        id: "2c",
        text: "If we offer a 'Lease-Overlapping' credit for 2 months, does that remove the barrier to moving?",
        intent: "Incentive Solutioning",
        impact: 9,
        rating: 'MASTER',
        feedback: "This is a surgical strike on her specific barrier. You've removed the financial risk of the overlapping lease.",
        coachTip: "Creative structuring is key for institutional/corporate expats who have strict budget cycles."
      },
      {
        id: "2d",
        text: "What specifically about waiting makes you feel more 'safe' than securing your home today?",
        intent: "LAER - Deep Exploration",
        impact: 10,
        rating: 'MASTER',
        feedback: "Perfect LAER exploration. You're uncovering whether 'safety' is financial, emotional, or logistical.",
        coachTip: "Always peel the onion. Once you understand her definition of 'safe', the solution becomes obvious."
      }
    ]
  },
  {
    id: "case-3",
    title: "The Rivalry Defense",
    customerName: "Mansour Bin Khalid",
    customerTitle: "Founder & CEO",
    company: "Desert Bloom Tech",
    objection: "Compound X just offered me 3 months free and a VIP move-in package. Why should I choose Azure?",
    context: "Mansour is a savvy negotiator looking for the best 'deal' rather than just the best home.",
    mentorTip: "Refocus from 'Incentives' to 'Outcome'. Incentives expire; community and reliability do not.",
    choices: [
      {
        id: "3a",
        text: "We can match their 3 months free if you sign a 24-month lease with us today.",
        intent: "Direct Competition (Price War)",
        impact: 4,
        rating: 'POOR',
        feedback: "Starting a price war is a race to the bottom. Azure is a premium brand; we don't need to match every gimmick.",
        coachTip: "When you match a discount, you admit that your base price wasn't justified by value."
      },
      {
        id: "3b",
        text: "3 months is strong. But our maintenance is 4 hours vs their 48. What is uptime worth?",
        intent: "Service Level Differentiation",
        impact: 9,
        rating: 'MASTER',
        feedback: "Brilliant. For a tech founder, 'uptime' and 'reliability' are high-value keywords. You've reframed the 'deal' around service.",
        coachTip: "Connect the community features to the resident's professional success."
      },
      {
        id: "3c",
        text: "They offer free months because construction quality is lower. You always get what you pay for.",
        intent: "Negative Selling",
        impact: 3,
        rating: 'POOR',
        feedback: "Badmouthing competition makes you look desperate and unprofessional. Focus on Azure's strengths instead.",
        coachTip: "Keep the conversation in our court. Highlight our superior specs without naming their flaws."
      },
      {
        id: "3d",
        text: "Setting aside the incentives, which community lifestyle actually aligns better with your goals?",
        intent: "Alignment Reframing",
        impact: 10,
        rating: 'MASTER',
        feedback: "By stripping away the 'gimmicks', you're forcing Mansour to evaluate the 3-year outcome vs. the 3-month saving.",
        coachTip: "Entrepreneurs value long-term ROI. Help him see the ROI of the Azure lifestyle."
      }
    ]
  },
  {
    id: "case-4",
    title: "The Diplomatic Margin",
    customerName: "Pierre Dupont",
    customerTitle: "Cultural Attaché",
    company: "French Embassy",
    objection: "My allowance is capped by the Ministry. Without a 15% reduction, I simply cannot get approval.",
    context: "Pierre is bound by institutional rules, not personal preference. This requires a structural solution.",
    mentorTip: "Look for non-rent value add-ons or creative billing structures (e.g., furniture packages included in rent).",
    choices: [
      {
        id: "4a",
        text: "I'm sorry, our prices are fixed by corporate. There is nothing I can do for you.",
        intent: "Hard Rejection",
        impact: 2,
        rating: 'POOR',
        feedback: "A hard 'no' ends the relationship. There is always a creative way to help a diplomatic client.",
        coachTip: "Institutional barriers are not personal rejections. They are puzzles waiting for a solution."
      },
      {
        id: "4b",
        text: "If we include the luxury furniture package, would that let you reallocate your other budget?",
        intent: "Creative Structuring",
        impact: 10,
        rating: 'MASTER',
        feedback: "Superb. You're helping him navigate his own bureaucracy by shifting where the value (and cost) is assigned.",
        coachTip: "Think like a consultant. Help the client justify the expense to their stakeholders."
      },
      {
        id: "4c",
        text: "Let me talk to my manager and see if we can make an exception for the Embassy.",
        intent: "Standard Escalation",
        impact: 6,
        rating: 'AVERAGE',
        feedback: "Escalation is safe, but it makes you look like you lack authority and creativity.",
        coachTip: "Try to propose the solution yourself before asking for management approval."
      },
      {
        id: "4d",
        text: "Could the Embassy sign a multi-unit corporate agreement? We can offer preferred rates for volume.",
        intent: "Volume Negotiation",
        impact: 8,
        rating: 'AVERAGE',
        feedback: "Good business thinking. You're trading price for volume, which is a standard B2B negotiation tactic.",
        coachTip: "Ensure Pierre has the authority to influence multiple units before committing to this route."
      }
    ]
  }
];
