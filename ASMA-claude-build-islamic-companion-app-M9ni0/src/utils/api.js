import { SYSTEM_PROMPT } from '../data';

// Claude API call function
export async function callClaude(userMessages) {
  try {
    // Prepend system context as first user message for better compatibility
    const messagesWithContext = [
      {
        role: 'user',
        content: `${SYSTEM_PROMPT}\n\n---\n\nNow respond to the following conversation as Asma:`,
      },
      {
        role: 'assistant',
        content:
          'I understand. I am Asma, a warm and knowledgeable Islamic companion. I will respond with compassion, cite proper sources, and maintain the voice of a wise older sister. How can I help you today?',
      },
      ...userMessages,
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: messagesWithContext,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

// Fallback explanations for offline/error scenarios
export const fallbackExplanations = {
  1: `This hadith is beautifully clear: your consent matters.

The Prophet ﷺ lived in a time when women were often treated as property—yet he insisted that no woman could be married without her genuine agreement. The Arabic word تُسْتَأْمَرَ means 'to be consulted'—not merely informed, but genuinely asked.

If anyone uses culture or family pressure to override your choice, that contradicts this clear teaching. You have every right to say no.`,

  2: `When Aisha got her period during Hajj, she cried. She felt she had ruined everything.

Look at how the Prophet ﷺ responded—not with disgust, but with these tender words: 'Allah wrote this.' The exemption from prayer is mercy, not punishment.

You can still make dhikr, dua, and feel close to your Creator. Your cycle is not a barrier between you and Allah.`,

  3: `In a world that judges women by appearance, weight, and status—this hadith is revolutionary.

Allah says: I don't look at that. He looks at your heart and deeds.

Your worth is not in your dress size or relationship status. It's in your sincerity and kindness. You are already enough in Allah's eyes.`,

  4: `If you're exhausted—spiritually, mentally, emotionally—this hadith speaks to you.

The Prophet ﷺ taught that your own self has a right over you. Rest is not laziness. Taking a break when burned out is not sinful—it's wise.

Allah wants your worship for a lifetime, not a burnout. Be gentle with yourself.`,

  5: `This hadith is often misused to trap women. Let's be clear: divorce is halal.

'The most disliked of permissible things'—it is still permissible. Allah dislikes the pain of separation, not the woman who needs it.

If you're in an abusive marriage, seeking divorce is using a door Allah Himself left open. Your safety matters.`,

  6: `The Prophet ﷺ—the best of creation—wept when his son died. He didn't hide his tears.

He taught us the difference between what's natural—tears, heartache—and what's prohibited—harming oneself.

Feeling devastated is not lack of faith. It's being human. You can cry and still trust Allah.`,

  7: `This hadith honors mothers immensely—but it should empower, not exhaust you.

The honor is in your sacrifice and love, not in being perfect. You don't have to do everything. You don't have to be everything.

Your humanity doesn't diminish your honor as a mother.`,

  8: `Haya is often reduced to women's clothing, but it's so much deeper.

It's about inner dignity, conscience, and awareness of Allah. It applies equally to everyone—men and women.

True haya is empowerment through self-respect, not restriction through shame.`,
};

// Generic fallback for any hadith not in the specific list
export const genericFallback = `This teaching reflects the mercy and wisdom in Islam's guidance. The Prophet ﷺ taught through both word and action.

For deeper questions, explore the scholarly notes or use Ask Safely to have a conversation about this topic.`;
