import { supabase } from './supabase';

export const DEFAULT_PROMPTS: Record<string, any> = {
  seo: {
    short: {
      title: 'Generate a viral, clickbaity YouTube Shorts title (under 60 characters).',
      description: 'Write a short, engaging description with keywords tailored for vertical video algorithms.',
      tags: 'Provide 5 highly relevant SEO tags separated by commas.',
      hashtags: 'Provide 3 trending hashtags suitable for YouTube Shorts.'
    },
    long: {
      title: 'Generate a highly optimized, curiosity-driven YouTube title.',
      description: 'Write a comprehensive SEO-optimized description with timestamps/chapters if applicable.',
      tags: 'Provide 15-20 comma-separated SEO tags for maximum reach.',
      hashtags: 'Provide 5 relevant hashtags.'
    }
  },
  content: {
    idea: {
      short: 'Suggest trending and viral short-form (Reels/Shorts) content ideas.',
      long: 'Suggest robust, high-retention long-form video concepts.'
    },
    script: {
      short: 'Write a fast-paced, high-retention 60-second script for vertical video.',
      long: 'Write a well-structured, engaging long-form YouTube script with a strong hook, body, and CTA.'
    }
  }
};

/**
 * Fetches prompts for a specific tool and section from the `ai_prompts` database table.
 * Falls back to default prompts if DB fails or values are missing.
 */
export async function fetchPrompts(tool: string, section: string) {
  try {
    const { data, error } = await supabase
      .from('ai_prompts')
      .select('sub_section, prompt_text, model_id')
      .eq('tool', tool)
      .eq('section', section);

    if (error) {
      console.warn('Failed to fetch AI prompts from DB, using defaults.', error);
      return DEFAULT_PROMPTS[tool]?.[section] || {};
    }

    const prompts: Record<string, any> = {};
    data?.forEach((p: any) => {
      prompts[p.sub_section] = {
        text: p.prompt_text,
        model: p.model_id || 'gemini'
      };
    });

    const defaults = DEFAULT_PROMPTS[tool]?.[section] || {};
    for (const sub in defaults) {
      if (!prompts[sub]) {
        prompts[sub] = defaults[sub];
      }
    }

    return prompts;
  } catch (err) {
    console.error('Unexpected error fetching prompts:', err);
    return DEFAULT_PROMPTS[tool]?.[section] || {};
  }
}
