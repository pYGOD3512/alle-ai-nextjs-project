import {
  ALargeSmall,
  Settings,
  HelpCircle,
  User,
  MessageSquare,
  MessagesSquare,
  Video,
  Music,
  ImageIcon,
  Bell,
  Handshake,
  LogOut,
  Braces,
  Heart,
  Share,
} from "lucide-react";

import { Transaction, Source, NotificationItem } from "@/lib/types";


export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  responses?: {
    model: string;
    content: string;
    icon: string;
  }[];
}

export interface ReleaseNote {
  id: string
  version: string
  date: string
  translations: {
    [key: string]: {
      title: string
      description: string
      details: {
        summary: string
        changes: string[]
        impact?: string
        technicalNotes?: string[]
      }
    }
  }
  type: "security" | "solve" | "error" | "testing"| "feature" | "fix" | "bug" | "improvement"
  image?: string
}

export const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Model Available",
    message: "Claude 3 Opus is now available for all users. Experience state-of-the-art AI with improved reasoning, coding, and mathematical capabilities.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: 'feature',
    priority: 'high',
    actionUrl: '/',
    actionLabel: 'Try it now',
    metadata: {
      category: 'AI Models',
      tags: ['claude', 'new-feature', 'ai'],
      relatedFeature: 'text-generation'
    }
  },
  {
    id: "2",
    title: "Security Update Required",
    message: "To ensure the security of your account, please enable two-factor authentication. This helps protect your data and access.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24),
    read: true,
    type: 'security',
    priority: 'high',
    actionUrl: '/',
    actionLabel: 'Enable 2FA',
    metadata: {
      category: 'Security',
      tags: ['security', '2fa', 'account'],
    }
  },
];

export const navItems = [
  {
    type: ALargeSmall,
    label: "Text size",
    interactionType: "modal",
    onClick: () => {
      // console.log("Opening Text Size Modal");
    },
  },
  {
    type: HelpCircle,
    label: "Help",
    interactionType: "function",
  },
  {
    type: MessagesSquare,
    label: "Feedback",
    interactionType: "modal",
    onClick: () => {
      // console.log("Opening Feedback Modal");
    },
  },
  {
    type: Bell,
    label: "Notifications",
    interactionType: "dropdown",
    dropdownItems: [
      {
        label: "All Notifications",
        icon: Bell,
        // onClick: () => console.log("All Notifications")
      },
    ],
  },
];

export const sidebarMenuItems = [
  { icon: MessageSquare, label: "Chat", href: "/" },
  { icon: ImageIcon, label: "Image Generation", href: "/image" },
  { icon: Music, label: "Audio Generation", beta: true, href: "/audio" },
  { icon: Video, label: "Video Generation", beta: true, href: "/video" },
];

// Helper function to generate random IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Generate timestamps from newest to oldest
const generateTimestamp = (index: number) => new Date(Date.now() - index * 1000 * 60 * 60);

export const chatHistory = [
  {
    id: generateId(),
    title: "Time to Build a Wall with Four: Key Insights on Effective Barrier Construction",
    createdAt: generateTimestamp(0),
    type: 'chat' as const
  },
  {
    id: generateId(),
    title: "Making $1 Million in 5 Days: Proven Strategies for Rapid Wealth Creation",
    createdAt: generateTimestamp(1),
    type: 'chat' as const
  },
  {
    id: generateId(),
    title: "The Future of Generative AI in Business: How AI is Transforming Industries and Creating New Opportunities",
    createdAt: generateTimestamp(2),
    type: 'chat' as const
  },
  {
    id: generateId(),
    title: "Strategies to Improve Employee Productivity: Effective Methods to Enhance Workplace Efficiency and Focus",
    createdAt: generateTimestamp(3),
    type: 'chat' as const
  },
  {
    id: generateId(),
    title: "Making $1 Million in 5 Days: A Guide to Quick Financial Success and Smart Investment Approaches",
    createdAt: generateTimestamp(4),
    type: 'chat' as const
  },
];

export const imageHistory = [
  {
    id: generateId(),
    title: "Sunset over mountain landscape",
    createdAt: generateTimestamp(0),
    type: 'image' as const
  },
  {
    id: generateId(),
    title: "Futuristic city skyline",
    createdAt: generateTimestamp(1),
    type: 'image' as const
  },
  {
    id: generateId(),
    title: "Abstract geometric patterns",
    createdAt: generateTimestamp(2),
    type: 'image' as const
  },
  {
    id: generateId(),
    title: "Cyberpunk character portrait",
    createdAt: generateTimestamp(3),
    type: 'image' as const
  },
];

export const audioHistory = [
  {
    id: generateId(),
    title: "Epic orchestral soundtrack",
    createdAt: generateTimestamp(0),
    type: 'audio' as const
  },
  {
    id: generateId(),
    title: "Lo-fi beats composition",
    createdAt: generateTimestamp(1),
    type: 'audio' as const
  },
  {
    id: generateId(),
    title: "Jazz piano improvisation",
    createdAt: generateTimestamp(2),
    type: 'audio' as const
  },
  {
    id: generateId(),
    title: "Electronic dance track",
    createdAt: generateTimestamp(3),
    type: 'audio' as const
  },
];

export const videoHistory = [
  {
    id: generateId(),
    title: "Product showcase animation",
    createdAt: generateTimestamp(0),
    type: 'video' as const
  },
  {
    id: generateId(),
    title: "3D environment flythrough",
    createdAt: generateTimestamp(1),
    type: 'video' as const
  },
  {
    id: generateId(),
    title: "Motion graphics intro",
    createdAt: generateTimestamp(2),
    type: 'video' as const
  },
  {
    id: generateId(),
    title: "Character animation test",
    createdAt: generateTimestamp(3),
    type: 'video' as const
  },
];

export const userMenuItems = [
  {
    label: "Profile",
    icon: User,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Profile Modal');
    },
  },
  {
    label: "Developer",
    icon: Braces,
    interactionType: "link",
    href: "https://alle-ai.com/developer",
  },
  {
    label: "Refer",
    icon: Handshake,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Refer Modal');
    },
  },
  {
    label: "Album",
    icon: Heart,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Refer Modal');
    },
  },
  {
    label: "Settings",
    icon: Settings,
    interactionType: "modal",
    onClick: () => {
      // console.log('Opening Settings Modal');
    },
  },
  {
    label: "LogOut",
    icon: LogOut,
    interactionType: "function",
    onClick: () => {
      // console.log('Logging out...');
    },
  },
];

export const CHAT_MODELS = [
  {
    id: "chatgpt-3-5-turbo",
    name: "ChatGPT 3.5",
    icon: "/models/gpt-3-5.png",
    provider: "OpenAI",
    type: "plus",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "gpt4",
    name: "GPT-4o",
    icon: "/models/gpt-4o.png",
    provider: "OpenAI",
    type: "free",
    preview: "Making one million dollars in just five...",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    icon: "/models/gemini.png",
    provider: "Google",
    type: "plus",
    preview: "Making a million dollars in 5 days is...",
  },
  {
    id: "llama-3-70b-instruct",
    name: "Llama 3 70B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "standard",
    preview: "The elusive goal of making $1 million in...",
  },
  {
    id: "llama-3-1-405b-instruct",
    name: "Llama 3.1 405B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "sonar-large-32k-online",
    name: "Sonar Large 32k Online",
    icon: "/models/perplexity-ai.png",
    provider: "Perplexity AI",
    type: "plus",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    icon: "/models/gpt-4o.png",
    provider: "OpenAI",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is...",
  },
  {
    id: "yi-large",
    name: "Yi-Large",
    icon: "/models/yi.png",
    provider: "01.AI",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "gemini-1-0-pro",
    name: "Gemini 1.0 Pro",
    icon: "/models/gemini.png",
    provider: "Google",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "llama-3-1-8b-instruct",
    name: "Llama 3.1 8B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "llama-3-1-70b-instruct",
    name: "Llama 3.1 70B Instruct",
    icon: "/models/meta.png",
    provider: "Meta",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "sonar-small-32k-online",
    name: "Sonar Small 32k Online",
    icon: "/models/perplexity-ai.png",
    provider: "Perplexity AI",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
  {
    id: "claude-3-hiaku",
    name: "Claude 3 Hiaku",
    icon: "/models/claude-3.png",
    provider: "Anthropic",
    type: "free",
    preview: "Making $1 million in just 5 days is an...",
  },
];

export const IMAGE_MODELS = [
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    icon: "/models/dall-e.png",
    provider: "OpenAI",
    type: "free",
    preview:
      "Create stunning, photorealistic images with OpenAI's latest model",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    icon: "/models/stability-ai.png",
    provider: "Stability AI",
    type: "free",
    preview:
      "Create stunning, photorealistic images with OpenAI's latest model",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "/models/midjourney.png",
    provider: "Midjourney",
    type: "free",
    preview: "Generate artistic and creative visuals with fine control",
  },
  {
    id: "titan-image-generator",
    name: "Titan Image Generator",
    icon: "/models/titan.png",
    provider: "Amazon",
    type: "plus",
    preview: "Generate artistic and creative visuals with fine control",
  },
];

export const AUDIO_MODELS = [
  {
    id: "whisper",
    name: "Whisper",
    icon: "/models/gpt-4.png",
    provider: "OpenAI",
    type: "free",
    preview: "State-of-the-art speech recognition and transcription",
  },
  {
    id: "musicgen",
    name: "MusicGen",
    icon: "/models/dream.png",
    provider: "musicgen",
    type: "free",
    preview: "Generate original music and sound effects",
  },
];

export const VIDEO_MODELS = [
  {
    id: "sora",
    name: "Sora",
    icon: "/models/gpt-4.png",
    provider: "OpenAI",
    type: "free",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
  {
    id: "runway",
    name: "Runway Gen-2",
    icon: "/models/runway.png",
    provider: "runaway",
    selected: "true",
    type: "free",
    preview: "Professional video generation and editing capabilities",
  },
  {
    id: "luma",
    name: "Luma AI",
    icon: "/models/luma.png",
    provider: "Dream Machine",
    selected: "true",
    type: "free",
    preview: "Professional video generation and editing capabilities",
  },
  {
    id: "kling",
    name: "Kling AI",
    icon: "/models/kling.png",
    provider: "Kuaishou Technology",
    type: "free",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
  {
    id: "animate-diff",
    name: "Animate Diff",
    icon: "/models/stability-ai.png",
    provider: "Stability AI",
    type: "free",
    preview: "Create realistic and imaginative videos with OpenAI's latest",
  },
];

export const MODEL_RESPONSES: { [key: string]: string } = {
  "chatgpt-3-5-turbo": `# 

## Day 1: Research and Planning
1. **Identify High-Yield Opportunities:**
   - Stock market
   - Cryptocurrencies
   - Real estate flipping
   - High-stakes poker or gambling (not recommended due to high risk)
   - Crowdfunding for a revolutionary product

2. **Market Analysis:**
   - Conduct thorough research on your chosen opportunity.
   - Analyze market trends, risks, and potential returns.

3. **Set Up Accounts:**
   - Create necessary accounts (brokerage, cryptocurrency exchange, etc.)
   - Ensure you have the required capital to invest.

## Day 2: Capital Mobilization
1. **Secure Initial Investment:**
   - Use savings, sell assets, or take loans (be cautious with debt).
   - Seek investors or partners if needed.

2. **Risk Management:**
   - Determine how much you can afford to lose.
   - Set stop-loss limits and diversify investments to mitigate risks.

## Day 3: Execution
1. **Make Investments:**
   - Buy stocks, cryptocurrencies, or other high-yield assets.
   - Invest in multiple opportunities to spread risk.

2. **Monitor Closely:**
   - Keep an eye on market movements.
   - Be ready to make quick decisions based on market changes.

## Day 4: Optimization
1. **Reassess Investments:**
   - Evaluate the performance of your investments.
   - Reallocate funds if necessary to maximize returns.

2. **Leverage News and Trends:**
   - Stay updated with financial news.
   - Take advantage of market-moving events.

## Day 5: Final Push and Exit Strategy
1. **Maximize Returns:**
   - Consider short-term trading strategies like day trading.
   - Use leverage carefully to amplify gains (high risk).

2. **Exit Strategy:**
   - Decide when to sell off investments to lock in profits.
   - Ensure you exit at the right time to maximize returns.

3. **Secure Profits:**
   - Transfer profits to a secure account.
   - Pay off any debts or loans taken for initial investment.

## Conclusion
Making a million dollars in 5 days is highly ambitious and fraught with risk. It requires expert knowledge, significant capital, and a bit of luck. Always consider the potential for loss and consult with financial advisors before making high-stakes investments.

**Disclaimer:** This guide is for informational purposes only. It is not financial advice.`,
  
  "gpt4": `Achieving a million dollars in just five days is an extremely ambitious goal and, for most people, unrealistic without prior preparation, substantial resources, or extraordinary circumstances. However, if you're aiming to build significant wealth over time, here are some strategies that can guide you toward financial success:

1. **Start with Passion**

   - Engage in work or a business that you are passionate about. Passion drives commitment and innovation, which are crucial for success. [lewishowes.com](https://lewishowes.com/podcast/how-to-make-1-million-online/?utm_source=chatgpt.com)

2. **Invest in Yourself**

   - Seek mentors and invest in education to enhance your skills and knowledge. Continuous learning can open new opportunities and pathways to wealth. [lewishowes.com](https://lewishowes.com/podcast/how-to-make-1-million-online/?utm_source=chatgpt.com)

3. **Build Multiple Income Streams**

   - Diversify your income sources to include passive income, such as investments in real estate or dividend-paying stocks. Multiple income streams provide financial stability and accelerate wealth accumulation. [nasdaq.com](https://www.nasdaq.com/articles/lazy-millionaire-8-ways-to-make-a-million-dollars-on-4-hours-a-day?utm_source=chatgpt.com)

4. **Practice Financial Discipline**

   - Keep a tight check on spending, live within your means, and save diligently. Financial discipline is essential for accumulating wealth. [investopedia.com](https://www.investopedia.com/articles/younginvestors/08/millionaire-mindset.asp?utm_source=chatgpt.com)

5. **Leverage the Power of Compounding**

   - Invest early and consistently to take advantage of compound interest, which can significantly grow your wealth over time. [nasdaq.com](https://www.nasdaq.com/articles/lazy-millionaire-8-ways-to-make-a-million-dollars-on-4-hours-a-day?utm_source=chatgpt.com)

6. **Set Clear Financial Goals**

- Define your financial objectives and create a plan to achieve them. Setting clear goals provides direction and motivation. [synchrony.com](https://www.synchrony.com/blog/banking/how-to-make-million-dollars?utm_source=chatgpt.com)

7. **Embrace Hard Work and Persistence**

   - Success requires dedication and perseverance. Be prepared to work hard and stay committed to your goals, even when faced with challenges.

For a more in-depth understanding, you might find this video helpful:

[How To Make A Million Dollars Step By Step](https://www.youtube.com/watch?v=-q8E1tcK9rU&utm_source=chatgpt.com)
`,
  
  "gemini-1-5-pro": `Unfortunately, there are no legitimate ways to make a million dollars in just five days. However, there are many ways to build wealth over time through hard work, smart investments, and sound financial planning.

Here are a few suggestions:

* **Start a business:** This is a great way to create wealth, but it takes time, effort, and often requires significant investment.
* **Invest in the stock market:** This can be a risky proposition, but it can also be a very rewarding one if you know what you're doing.
* **Save your money:** This may seem like a no-brainer, but it's often the most difficult thing to do. However, it's essential for building wealth over time.
* **Get a good education:** A good education can lead to a higher-paying job, which can help you build wealth more quickly.

Remember, there is no magic bullet when it comes to making money. The best way to build wealth is to focus on your long-term goals and make smart decisions along the way.
  `,
  
  "llama-3-70b-instruct": `Making a Million Dollars in 5 Days
----------------------------------

Online Businesses
-----------------

*   Creating and selling an online course can generate significant revenue. Platforms like Udemy, Teachable, or Skillshare can host courses. [Forbes](https://www.forbes.com/)
    
*   Building a high-traffic blog or YouTube channel with affiliate marketing or sponsorships can also be lucrative. [Entrepreneur](https://www.entrepreneur.com/)
    

Trading and Investing
---------------------

*   Trading stocks, options, or cryptocurrencies can potentially yield high returns, but it's essential to understand the risks involved. [Investopedia](https://www.investopedia.com/)
    
*   Investing in real estate investment trusts (REITs) or crowdfunding platforms can provide opportunities for high returns. [The Balance](https://www.thebalance.com/)
    

Other Opportunities
-------------------

*   Creating and selling a mobile app or game can generate significant revenue through in-app purchases or advertising. [Business Insider](https://www.businessinsider.com/)
    
*   Participating in high-stakes competitions or tournaments, such as poker or esports, can also yield high returns. [ESPN](https://www.espn.com/)
    

Please note that these sources provide general information and should not be considered personalized advice. Making a million dollars in 5 days is extremely challenging and often requires a combination of hard work, smart decisions, and luck.`,
  
  "claude-3-5-sonnet": "Let me provide a balanced perspective on making $1 million in 5 days. While technically possible, it would require: 1) Substantial initial capital 2) Extremely favorable market conditions 3) High-risk tolerance. Consider focusing on more sustainable long-term wealth building strategies.",

  "sonar-large-32k-online": "Making $1 million in 5 days is extremely challenging. Here's a realistic perspective: Start with identifying high-value opportunities, leverage existing networks, and focus on scalable solutions. However, remember that sustainable wealth building typically takes more time.",

  "gpt-4o-mini": "While making $1 million in 5 days is an ambitious goal, let's break this down strategically: 1) Identify existing assets that can be leveraged 2) Look for high-return investment opportunities 3) Consider business acquisitions or mergers. However, I must emphasize that such rapid wealth creation carries significant risks.",

  "claude-3-opus": "Let me provide a balanced perspective on making $1 million in 5 days. While technically possible, it would require: 1) Substantial initial capital 2) Extremely favorable market conditions 3) High-risk tolerance. Consider focusing on more sustainable long-term wealth building strategies.",

  "yi-large": "The goal of making $1 million in 5 days requires careful consideration. Here's my analysis: First, evaluate your current resources. Second, identify potential high-return opportunities. Third, understand the associated risks. Remember, sustainable wealth building typically requires more time.",

  "gemini-1-0-pro": "From a practical standpoint, generating $1 million in 5 days would require: 1. Exceptional market timing 2. Significant initial capital 3. High-risk opportunities. Consider more sustainable approaches to wealth building that align with your resources and risk tolerance.",
};

export const initialMessages: Message[] = [];

export const socialMediaOptions = [
  {
    name: 'X',
    icon: '/svgs/x_white.png',
    color: 'bg-[#0088cc]/10',
    hoverColor: 'hover:bg-[#0088cc]/20',
    textColor: 'text-[#4267B2]',
    handler: (url: string) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    icon: '/svgs/facebook.svg',
    color: 'bg-[#4267B2]/10',
    hoverColor: 'hover:bg-[#4267B2]/20',
    textColor: 'text-[#4267B2]',
    handler: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'Reddit',
    icon: '/svgs/reddit.svg',
    color: 'bg-[#FF4500]/10',
    hoverColor: 'hover:bg-[#FF4500]/20',
    textColor: 'text-[#FF4500]',
    handler: (url: string) => `https://reddit.com/submit?url=${encodeURIComponent(url)}`
  },
  {
    name: 'Discord',
    icon: '/svgs/discord.svg',
    color: 'bg-[#5865F2]/10',
    hoverColor: 'hover:bg-[#5865F2]/20',
    textColor: 'text-[#5865F2]',
    handler: (url: string) => `https://discord.com/channels/@me`
  },
  {
    name: 'WhatsApp',
    icon: '/svgs/whatsapp.svg',
    color: 'bg-[#25D366]/10',
    hoverColor: 'hover:bg-[#25D366]/20',
    textColor: 'text-[#25D366]',
    handler: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`
  },
  {
    name: 'Telegram',
    icon: '/svgs/telegram.svg',
    color: 'bg-[#0088cc]/10',
    hoverColor: 'hover:bg-[#0088cc]/20',
    textColor: 'text-[#0088cc]',
    handler: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`
  }
];

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
]

export function getLocalizedContent(release: ReleaseNote, language: string) {
  return release.translations[language] || release.translations['en'];
}

export const releaseNotesData: ReleaseNote[] = [
  {
    id: "1",
    version: "v2.1.0",
    date: "2024-12-01",
    type: "feature",
    translations: {
      en: {
        title: "Launch New User Authentication System",
        description: "Introduced a secure, modern authentication system with multi-factor authentication and social media login integration.",
        details: {
          summary: "A complete overhaul of our authentication system to provide enhanced security and user convenience.",
          changes: [
            "Implemented OAuth 2.0 protocol for social media login",
            "Added support for TOTP-based 2FA",
            "Introduced session management with automatic timeout",
            "Enhanced password policy enforcement"
          ],
          impact: "This update significantly improves platform security while making the login process more convenient for users.",
          technicalNotes: [
            "Migration required for existing authentication tokens",
            "New environment variables needed for OAuth providers",
            "Updated API endpoints for authentication flows"
          ]
        }
      },
      es: {
        title: "Lanzamiento del Nuevo Sistema de Autenticación",
        description: "Se introdujo un sistema de autenticación moderno y seguro con autenticación multifactor e integración de inicio de sesión con redes sociales.",
        details: {
          summary: "Una renovación completa de nuestro sistema de autenticación para mejorar la seguridad y la comodidad del usuario.",
          changes: [
            "Implementación del protocolo OAuth 2.0 para inicio de sesión con redes sociales",
            "Añadido soporte para 2FA basado en TOTP",
            "Introducción de gestión de sesiones con tiempo de espera automático",
            "Mejora en la política de contraseñas"
          ],
          impact: "Esta actualización mejora significativamente la seguridad de la plataforma mientras hace más conveniente el proceso de inicio de sesión.",
          technicalNotes: [
            "Migración requerida para tokens de autenticación existentes",
            "Nuevas variables de entorno necesarias para proveedores OAuth",
            "Endpoints de API actualizados para flujos de autenticación"
          ]
        }
      },
      //other language translations...
    }
  },
  {
    "id": "2",
    "version": "v2.2.0",
    "date": "2024-12-15",
    "type": "feature",
    "translations": {
      "en": {
        "title": "Improved Search Functionality",
        "description": "Enhanced search engine with advanced filtering options and faster response time.",
        "details": {
          "summary": "We have revamped the search functionality, making it faster and more intuitive.",
          "changes": [
            "Added advanced filters (category, price range, rating)",
            "Improved search indexing for faster results",
            "Optimized search algorithm for better accuracy",
            "Introduced an auto-complete feature for search suggestions"
          ],
          "impact": "This update improves the accuracy and speed of search results, offering a better user experience.",
          "technicalNotes": [
            "New search indexing system implemented",
            "Minor database schema changes to support new filters",
            "Improved search query performance"
          ]
        }
      },
      "es": {
        "title": "Funcionalidad de Búsqueda Mejorada",
        "description": "Motor de búsqueda mejorado con opciones avanzadas de filtrado y tiempos de respuesta más rápidos.",
        "details": {
          "summary": "Hemos renovado la funcionalidad de búsqueda, haciéndola más rápida e intuitiva.",
          "changes": [
            "Añadidos filtros avanzados (categoría, rango de precio, calificación)",
            "Mejorada la indexación de búsqueda para obtener resultados más rápidos",
            "Optimizando el algoritmo de búsqueda para mayor precisión",
            "Introducción de la función de autocompletado para sugerencias de búsqueda"
          ],
          "impact": "Esta actualización mejora la precisión y la velocidad de los resultados de búsqueda, ofreciendo una mejor experiencia al usuario.",
          "technicalNotes": [
            "Nuevo sistema de indexación de búsqueda implementado",
            "Pequeños cambios en el esquema de la base de datos para soportar los nuevos filtros",
            "Mejora en el rendimiento de las consultas de búsqueda"
          ]
        }
      }
    }
  },
  {
    "id": "3",
    "version": "v2.1.1",
    "date": "2024-12-05",
    "type": "fix",
    "translations": {
      "en": {
        "title": "Bug Fix for Checkout Process",
        "description": "Resolved an issue where users were unable to complete their purchase due to a payment gateway error.",
        "details": {
          "summary": "A bug was fixed in the checkout flow that was preventing users from finalizing their purchases.",
          "changes": [
            "Fixed an issue causing payment gateway errors during checkout",
            "Improved error handling for failed transactions",
            "Enhanced user feedback during payment processing"
          ],
          "impact": "Users can now complete their purchases without errors, improving overall customer satisfaction.",
          "technicalNotes": [
            "Payment gateway API updated to handle errors more gracefully",
            "Improved logging for transaction failures"
          ]
        }
      },
      "es": {
        "title": "Corrección de Error en el Proceso de Pago",
        "description": "Se resolvió un problema donde los usuarios no podían completar su compra debido a un error en la pasarela de pago.",
        "details": {
          "summary": "Se corrigió un error en el flujo de pago que impedía a los usuarios finalizar sus compras.",
          "changes": [
            "Corrección de un error que causaba fallos en la pasarela de pago durante el proceso de pago",
            "Mejora en el manejo de errores para transacciones fallidas",
            "Mejora en la retroalimentación al usuario durante el procesamiento del pago"
          ],
          "impact": "Los usuarios ahora pueden completar sus compras sin errores, mejorando la satisfacción general del cliente.",
          "technicalNotes": [
            "API de la pasarela de pago actualizada para manejar errores de manera más eficiente",
            "Mejoras en el registro de fallos de transacciones"
          ]
        }
      }
    }
  },
  {
    "id": "4",
    "version": "v2.3.0",
    "date": "2024-12-20",
    "type": "feature",
    "translations": {
      "en": {
        "title": "Mobile App Interface Overhaul",
        "description": "The mobile app interface has been redesigned to provide a more modern and user-friendly experience.",
        "details": {
          "summary": "The user interface of the mobile app has been completely updated for a fresh, clean look and better usability.",
          "changes": [
            "Revamped app navigation with simplified menu structure",
            "Updated design with a more consistent color scheme",
            "Introduced bottom navigation bar for easier access to key features",
            "Redesigned user profiles with updated layout and options"
          ],
          "impact": "The new interface improves overall usability and aesthetic appeal, providing a more modern and streamlined experience.",
          "technicalNotes": [
            "UI/UX team collaborated on new design system",
            "Reworked app components to follow modern design guidelines",
            "Performance optimizations for smoother animations"
          ]
        }
      },
      "es": {
        "title": "Renovación de la Interfaz de la App Móvil",
        "description": "La interfaz de la app móvil ha sido rediseñada para ofrecer una experiencia más moderna y fácil de usar.",
        "details": {
          "summary": "La interfaz de usuario de la app móvil ha sido completamente actualizada para ofrecer un aspecto fresco, limpio y mejor usabilidad.",
          "changes": [
            "Renovación de la navegación de la app con una estructura de menú simplificada",
            "Diseño actualizado con una paleta de colores más consistente",
            "Introducción de una barra de navegación inferior para un acceso más fácil a las funciones clave",
            "Rediseño de perfiles de usuario con un nuevo diseño y opciones"
          ],
          "impact": "La nueva interfaz mejora la usabilidad general y el atractivo estético, ofreciendo una experiencia más moderna y fluida.",
          "technicalNotes": [
            "El equipo de UI/UX colaboró en el nuevo sistema de diseño",
            "Reestructuración de componentes de la app siguiendo las pautas de diseño modernas",
            "Optimizaciones de rendimiento para animaciones más fluidas"
          ]
        }
      }
    }
  },
  {
    "id": "5",
    "version": "v2.1.2",
    "date": "2024-12-10",
    "type": "testing",
    "translations": {
      "en": {
        "title": "New Unit Tests for User Registration",
        "description": "Added unit tests to validate user registration and error handling for new accounts.",
        "details": {
          "summary": "New unit tests were created to ensure the user registration flow works correctly and catches errors.",
          "changes": [
            "Created unit tests for user registration functionality",
            "Tested various edge cases, including duplicate accounts and invalid inputs",
            "Added mock data for testing API responses"
          ],
          "impact": "This ensures that user registration works smoothly and errors are properly handled, improving code quality.",
          "technicalNotes": [
            "New testing framework implemented for unit testing",
            "Test suite integrated into the CI pipeline for continuous validation"
          ]
        }
      },
      "es": {
        "title": "Nuevas Pruebas Unitarias para el Registro de Usuario",
        "description": "Se añadieron pruebas unitarias para validar el registro de usuario y el manejo de errores para nuevas cuentas.",
        "details": {
          "summary": "Se crearon nuevas pruebas unitarias para garantizar que el flujo de registro de usuario funcione correctamente y maneje errores.",
          "changes": [
            "Creación de pruebas unitarias para la funcionalidad de registro de usuario",
            "Se probaron varios casos extremos, incluidos cuentas duplicadas y entradas no válidas",
            "Añadidos datos simulados para probar las respuestas de la API"
          ],
          "impact": "Esto garantiza que el registro de usuarios funcione sin problemas y que los errores se manejen correctamente, mejorando la calidad del código.",
          "technicalNotes": [
            "Nuevo marco de pruebas implementado para pruebas unitarias",
            "La suite de pruebas se integró en la pipeline de CI para validación continua"
          ]
        }
      }
    }
  },  
  {
    "id": "6",
    "version": "v2.4.0",
    "date": "2024-12-25",
    "type": "feature",
    "translations": {
      "en": {
        "title": "Enhanced Email Notifications System",
        "description": "New customizable email notifications with better tracking and user preferences.",
        "details": {
          "summary": "The email notifications system has been improved to give users more control over the emails they receive.",
          "changes": [
            "Added user preferences for customizing notification types",
            "Introduced email tracking to confirm delivery and open rates",
            "Improved email content design for better readability",
            "Added support for rich media in email templates"
          ],
          "impact": "This update allows users to have more control over email communication and improves email engagement.",
          "technicalNotes": [
            "New user preference settings added to profile page",
            "Tracking integration added to the email sending system",
            "Email templates now support HTML5 and embedded media"
          ]
        }
      },
      "es": {
        "title": "Sistema Mejorado de Notificaciones por Correo Electrónico",
        "description": "Nuevas notificaciones por correo electrónico personalizables con mejor seguimiento y preferencias del usuario.",
        "details": {
          "summary": "El sistema de notificaciones por correo electrónico ha sido mejorado para dar a los usuarios más control sobre los correos que reciben.",
          "changes": [
            "Añadidas preferencias de usuario para personalizar los tipos de notificaciones",
            "Introducción de seguimiento de correos electrónicos para confirmar entrega y tasa de aperturas",
            "Mejora en el diseño del contenido de los correos para mayor legibilidad",
            "Añadido soporte para medios enriquecidos en plantillas de correos"
          ],
          "impact": "Esta actualización permite a los usuarios tener más control sobre las comunicaciones por correo electrónico y mejora el compromiso con los correos.",
          "technicalNotes": [
            "Nuevas configuraciones de preferencias de usuario añadidas a la página de perfil",
            "Integración de seguimiento añadida al sistema de envío de correos",
            "Las plantillas de correo ahora soportan HTML5 y medios incrustados"
          ]
        }
      }
    }
  },
  {
    "id": "8",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "9",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "10",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "11",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "12",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "13",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "14",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  {
    "id": "7",
    "version": "v2.1.3",
    "date": "2024-12-12",
    "type": "security",
    "translations": {
      "en": {
        "title": "Security Patch for Data Encryption Vulnerability",
        "description": "Fixed a vulnerability related to weak data encryption in user communications and storage.",
        "details": {
          "summary": "A security vulnerability was identified and patched to strengthen encryption methods for user data.",
          "changes": [
            "Upgraded encryption algorithms for data at rest and in transit",
            "Implemented AES-256 encryption for sensitive user data",
            "Added additional encryption for API communication and database storage"
          ],
          "impact": "This patch ensures that user data is now better protected against potential attacks, enhancing overall security.",
          "technicalNotes": [
            "Encryption keys were rotated as part of the update",
            "New security protocols were applied for API communications"
          ]
        }
      },
      "es": {
        "title": "Parché de Seguridad para Vulnerabilidad de Cifrado de Datos",
        "description": "Se solucionó una vulnerabilidad relacionada con un cifrado débil de datos en las comunicaciones y almacenamiento de usuarios.",
        "details": {
          "summary": "Se identificó y corrigió una vulnerabilidad de seguridad para fortalecer los métodos de cifrado de los datos de los usuarios.",
          "changes": [
            "Actualización de los algoritmos de cifrado para los datos en reposo y en tránsito",
            "Implementación de cifrado AES-256 para los datos sensibles de los usuarios",
            "Añadido cifrado adicional para la comunicación API y el almacenamiento en base de datos"
          ],
          "impact": "Este parche garantiza que los datos de los usuarios ahora estén mejor protegidos contra posibles ataques, mejorando la seguridad general.",
          "technicalNotes": [
            "Las claves de cifrado fueron rotadas como parte de la actualización",
            "Se aplicaron nuevos protocolos de seguridad para las comunicaciones API"
          ]
        }
      }
    }
  },
  //more release notes...
]

export const SAMPLE_ADS = [
  {
    id: "1",
    title: "Boost Your Business with AI-Powered Automation",
    description: "Automate tasks and scale your business faster with AI-driven solutions. Get started today!",
    imageUrl: "https://plus.unsplash.com/premium_photo-1679397476740-a236a0c87fad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9uZXl8ZW58MHx8MHx8fDA%3D",
    link: "https://automation.ai",
    pill: "🤖 Try Automation Tools"
  },
  {
    id: "2",
    title: "Transform Your Marketing with AI Insights",
    description: "Leverage AI to unlock deep marketing insights, optimize your strategy, and grow your brand.",
    imageUrl: "https://images.unsplash.com/photo-1518183214770-9cffbec72538?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bW9uZXl8ZW58MHx8MHx8fDA%3D",
    link: "https://marketing.ai",
    pill: "📊 Discover Marketing AI"
  },
  {
    id: "3",
    title: "AI Tools for Data-Driven Decisions",
    description: "Make smarter business decisions with powerful AI analytics and data-driven insights.",
    imageUrl: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vbmV5fGVufDB8fDB8fHww",
    link: "https://data.ai",
    pill: "📈 Try Data Analytics Tools"
  }
];

export const transactions: Transaction[] = [
  {
    id: 'txn_1',
    type: 'subscription',
    amount: 20.00,
    mode: 'card',
    status: 'failed',
    plan: 'Standard Monthly',
    date: new Date('2024-03-15'),
    cardLast4: '4242',
    description: 'Monthly subscription payment',
  },
  {
    id: 'txn_2',
    type: 'referral',
    amount: 5.00,
    mode: 'platform',
    status: 'completed',
    date: new Date('2024-03-14'),
    description: 'Referral bonus from user@example.com'
  },
  {
    id: 'txn_3',
    type: 'subscription',
    amount: 300.00,
    mode: 'platform',
    status: 'completed',
    plan: 'Plus Yearly',
    date: new Date('2024-03-10'),
    description: 'Yearly subscription using referral credits'
  },
  {
    id: 'txn_4',
    type: 'referral',
    amount: 20.00,
    mode: 'card',
    status: 'completed',
    plan: 'Standard Monthly',
    date: new Date('2024-03-14'),
    description: 'Monthly subscription using referral credits'
  },
  {
    id: 'txn_5',
    type: 'referral',
    amount: 5.00,
    mode: 'platform',
    status: 'pending',
    plan: "Plus Monthly",
    date: new Date('2024-03-14'),
    description: 'Referral bonus from user@example.com'
  },
  {
    id: 'txn_6',
    type: 'referral',
    amount: 5.00,
    mode: 'platform',
    status: 'pending',
    date: new Date('2024-03-14'),
    description: 'Referral bonus from user@example.com'
  },
  {
    id: 'txn_7',
    type: 'subscription',
    amount: 20.00,
    mode: 'card',
    status: 'failed',
    plan: 'Standard Monthly',
    date: new Date('2024-03-15'),
    cardLast4: '4242',
    description: 'Monthly subscription payment',
  },
];

// Types for our data and state
type TimeRange = '24h' | '7d' | '30d' | '90d';
type ChartType = 'bar' | 'pie' | 'line';

interface ModelUsage {
  model: string;
  usage: number;
}

interface CategoryUsage {
  label: string;
  value: number;
}

interface TimeSeriesData {
  date: string;
  [key: string]: number | string; 
}

export const modelUsageData: ModelUsage[] = [
  { model: 'GPT-4', usage: 450, },
  { model: 'DALL-E', usage: 280 },
  { model: 'Claude', usage: 320 },
  { model: 'Stable Diffusion', usage: 200 },
  { model: 'Whisper', usage: 150 },
];

export const categoryUsageData: CategoryUsage[] = [
  { label: 'Text Generation', value: 45 },
  { label: 'Image Generation', value: 25 },
  { label: 'Audio Generation', value: 15 },
  { label: 'Video Generation', value: 15 },
];

export const timeSeriesData: TimeSeriesData[] = [
  { date: '2024-01', 'GPT-4': 65, 'DALL-E': 28, 'Claude': 45, 'Gemini': 30 },
  { date: '2024-02', 'GPT-4': 59, 'DALL-E': 48, 'Claude': 38, 'Gemini': 49 },
  { date: '2024-03', 'GPT-4': 80, 'DALL-E': 40, 'Claude': 43, 'Gemini': 80 },
  { date: '2024-04', 'GPT-4': 81, 'DALL-E': 35, 'Claude': 52, 'Gemini': 62 },
  { date: '2024-05', 'GPT-4': 56, 'DALL-E': 45, 'Claude': 47, 'Gemini': 35 },
];

export const EXAMPLE_SOURCES: Source [] = [
  {
    type: "podcast",
    title: "How to Make $1 Million Online - Lewis Howes",
    description: "Lewis Howes discusses strategies for building wealth online, emphasizing the importance of passion and self-investment.",
    url: "https://lewishowes.com/podcast/how-to-make-1-million-online/?utm_source=chatgpt.com",
    img: "/icons/lewis_howes.png"
  },
  {
    type: "article",
    title: "Lazy Millionaire: 8 Ways to Make a Million Dollars on 4 Hours a Day - Nasdaq",
    description: "This article explores various methods to achieve millionaire status with minimal daily work hours, highlighting the power of compounding and multiple income streams.",
    url: "https://www.nasdaq.com/articles/lazy-millionaire-8-ways-to-make-a-million-dollars-on-4-hours-a-day?utm_source=chatgpt.com",
    img: "/icons/nasdaq.png"
  },
  {
    type: "article",
    title: "The Millionaire Mindset: How to Think, Act, and Grow Rich - Investopedia",
    description: "Investopedia delves into the mindset required for financial success, including the importance of financial discipline and goal setting.",
    url: "https://www.investopedia.com/articles/younginvestors/08/millionaire-mindset.asp?utm_source=chatgpt.com",
    img: "/icons/investopedia.png"
  },
  {
    type: "article",
    title: "How to Make a Million Dollars - Synchrony",
    description: "Synchrony provides insights into setting clear financial goals and the steps necessary to achieve millionaire status.",
    url: "https://www.synchrony.com/blog/banking/how-to-make-million-dollars?utm_source=chatgpt.com",
    img: "/icons/synchrony.png"
  },
  {
    type: "video",
    title: "How To Make A Million Dollars Step By Step",
    description: "A comprehensive guide on the steps to becoming a millionaire, presented in an easy-to-follow video format.",
    url: "https://www.youtube.com/watch?v=-q8E1tcK9rU&utm_source=chatgpt.com",
    img: "/icons/youtube.png"
  }
];

export const EXAMPLE_SOURCES_SIMPLE: Source[] = [
  {
    type: 'wikipedia',
    title: 'Example Source 1',
    description: 'Example description 1...',
    url: 'https://example.com/1',
    img: 'iocns/espn.png',
  },
  {
    type: 'encyclopedia',
    title: 'Example Source 2',
    description: 'Example description 2...',
    url: 'https://example.com/2',
    img: 'iocns/espn.png',
  }
];
