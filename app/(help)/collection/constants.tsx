import { HelpCategories } from "@/lib/types";

export const helpCategories: HelpCategories = {
    "3943089-account-login-and-billing": {
      id: "3943089",
      iconName: "Settings",
      title: "Account, login and billing",
      description: "Refund requests, billing and login issues",
      sections: [
        {
          title: "Login & Authentication",
          articles: [
            {
              id: "reset-password",
              title: "Why can't I reset my password?",
              description: "Troubleshooting steps for password reset issues",
              readingTime: "3 min read"
            },
            {
              id: "phone-verification",
              title: "Why am I not receiving my phone verification code?",
              description: "Troubleshooting tips for receiving verification code",
              readingTime: "4 min read"
            },
            {
              id: "auth-method",
              title: "Can I change my authentication method?",
              description: "Learn how to update your sign-in preferences",
              readingTime: "2 min read"
            },
            {
              id: "change-password",
              title: "How do I change my account password?",
              description: "Follow the steps below to reset your password",
              readingTime: "3 min read"
            }
          ]
        },
        {
          title: "Account Settings",
          articles: [
            {
              id: "change-org",
              title: "How can I change my default organization?",
              description: "Steps to update your organization settings",
              readingTime: "2 min read"
            },
            {
              id: "change-email",
              title: "How to change your email address",
              description: "We do not support changing an email address. This article includes other available options.",
              readingTime: "3 min read"
            },
            {
              id: "manage-members",
              title: "How do I add, change, or remove members on my OpenAI API account?",
              description: "Learn how to add, remove, or invite members to an account and understand the permissions/roles",
              readingTime: "5 min read"
            }
          ]
        },
        {
          title: "Support",
          articles: [
            {
              id: "contact-support",
              title: "How can I contact support?",
              description: "Learn how to get in touch with our support team",
              readingTime: "2 min read"
            }
          ]
        }
      ]
    },
    "6864268-privacy-and-policies": {
      id: "6864268",
      iconName: "BriefcaseBusiness",
      title: "Privacy and policies",
      description: "Details on terms of service, data privacy and usage policies",
      sections: [
        {
          title: "Privacy",
          articles: [
            {
              id: "privacy-policy",
              title: "Privacy Policy",
              description: "Our commitment to protecting your privacy",
              readingTime: "10 min read"
            },
            {
              id: "data-usage",
              title: "How is my data used?",
              description: "Understanding how we handle your information",
              readingTime: "5 min read"
            },
            {
              id: "data-deletion",
              title: "Requesting data deletion",
              description: "Learn how to request deletion of your personal data",
              readingTime: "3 min read"
            }
          ]
        },
        {
          title: "Terms & Policies",
          articles: [
            {
              id: "terms-service",
              title: "Terms of Service",
              description: "Read our terms of service agreement",
              readingTime: "10 min read"
            },
            {
              id: "usage-policies",
              title: "Usage Policies",
              description: "Guidelines for using our services",
              readingTime: "7 min read"
            },
            {
              id: "content-policy",
              title: "Content Policy",
              description: "Understanding what content is allowed",
              readingTime: "5 min read"
            }
          ]
        }
      ]
    },
    "3675931-api": {
      id: "3675931",
      iconName: "Code",
      title: "API",
      description: "Common questions related to our APIs and models",
      sections: [
        {
            title: 'API',
            articles: [
                {
                id: "apis",
                title: "API",
                description: "Read our apis",
                readingTime: "10 min read"
                }
            ]
        }
      ]
    },
    "3742473-alle-ai": {
      id: "3742473",
      iconName: "MessageCircleMore",
      title: "Alle-AI",
      description: "All things about Alle-AI",
      sections : [
        {
            title: "About Alle-AI",
            articles: [
                {
                id: "1",
                title: "What does Alle-AI do",
                description: "Understanding the concept and process of Alle-AI",
                readingTime: "10 min read"
                },
            ]
        }
      ]
      
    },
    "7835004-alle-ai-custom": {
      id: "7835004",
      iconName: "FolderCog",
      title: "Alle-AI Custom",
      description: "All things about Alle-AI Custom plan",
      sections: [
        {
            title: "Alle-AI Custom",
            articles: [
                {
                id: "1",
                title: "API",
                description: "Read our apis",
                readingTime: "10 min read"
                },
            ]
        }
      ]
      
    },
    "5688074-alle-ai-teams": {
      id: "5688074",
      iconName: "Users",
      title: "Alle-AI Teams",
      description: "A self-serve subscription plan designed for organizations and businesses wishing to adopt ChatGPT for use among their teams",
      sections: [
        {
            title: "Teams",
            articles: [
                {
                id: "1",
                title: "API",
                description: "Read our apis",
                readingTime: "10 min read"
                },
            ]
        }
      ]
    },
    "11106745-alle-ai-enterprise": {
      id: "11106745",
      iconName: "Building2",
      title: "Alle-AI Enterprise",
      description: "All things about Alle-AI Enterprise",
      sections: [
        {
            title: "Alle-AI Enterprise",
            articles: [
                {
                  id: "1",
                  title: "API",
                  description: "Read our apis",
                  readingTime: "10 min read"
                },
              ]
        }
      ]
    },
    // Add other categories...
};
