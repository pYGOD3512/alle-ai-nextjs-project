import React from "react";
import NavigationContainer from "@/components/NavigationContainer";
// Data Objects
const usageTiersData = [
  {
    tier: "Free",
    qualification: "User must be in an allowed geography",
    usageLimits: "$100 / month",
  },
  {
    tier: "Tier 1",
    qualification: "$5 paid",
    usageLimits: "$100 / month",
  },
  {
    tier: "Tier 2",
    qualification: "$50 paid and 7+ days since first payment",
    usageLimits: "$500 / month",
  },
  {
    tier: "Tier 3",
    qualification: "$100 paid and 7+ days since first payment",
    usageLimits: "$1,000 / month",
  },
  {
    tier: "Tier 4",
    qualification: "$250 paid and 14+ days since first payment",
    usageLimits: "$5,000 / month",
  },
  {
    tier: "Tier 5",
    qualification: "$1,000 paid and 30+ days since first payment",
    usageLimits: "$200,000 / month",
  },
];

const modelLimitsData = {
  chat: {
    title: "Chat Models",
    headers: ["Model", "RPM", "RPD", "TPM", "TPD"],
    models: [
      {
        name: "gpt-4-mini",
        rpm: 3,
        rpd: 200,
        tpm: "40,000",
        tpd: "1,000,000",
      },
      {
        name: "gpt-4-standard",
        rpm: 10,
        rpd: 500,
        tpm: "150,000",
        tpd: "5,000,000",
      },
      {
        name: "gpt-4-advanced",
        rpm: 20,
        rpd: 1000,
        tpm: "300,000",
        tpd: "10,000,000",
      },
    ],
  },
  image: {
    title: "Image Models",
    headers: ["Model", "IPM", "RPD"],
    models: [
      {
        name: "dall-e-2",
        ipm: 5,
        rpd: 200,
      },
      {
        name: "dall-e-3",
        ipm: 1,
        rpd: 100,
      },
    ],
  },
  audio: {
    title: "Audio Models",
    headers: ["Model", "APM", "RPD"],
    models: [
      {
        name: "whisper-1",
        apm: 3,
        rpd: 200,
      },
      {
        name: "tts-1",
        apm: 3,
        rpd: 200,
      },
    ],
  },
  video: {
    title: "Video Models",
    headers: ["Model", "VPM", "RPD"],
    models: [
      {
        name: "video-gen-1",
        vpm: 1,
        rpd: 50,
      },
      {
        name: "video-gen-2",
        vpm: 2,
        rpd: 100,
      },
    ],
  },
};

const headerData = [
  {
    field: "x-ratelimit-limit-requests",
    value: "60",
    description: "Maximum requests allowed before hitting the limit.",
  },
  {
    field: "x-ratelimit-limit-tokens",
    value: "150,000",
    description: "Maximum tokens allowed before hitting the limit.",
  },
  {
    field: "x-ratelimit-remaining-requests",
    value: "59",
    description: "Remaining requests before hitting the limit.",
  },
  {
    field: "x-ratelimit-remaining-tokens",
    value: "149,984",
    description: "Remaining tokens before hitting the limit.",
  },
  {
    field: "x-ratelimit-reset-requests",
    value: "1s",
    description: "Time until the request limit resets.",
  },
  {
    field: "x-ratelimit-reset-tokens",
    value: "6m0s",
    description: "Time until the token limit resets.",
  },
];

const rateProtectionReasons = [
  {
    title: "Prevent Abuse or Misuse",
    description:
      "Rate limits protect against malicious actors who might flood the API with requests to overload it or disrupt services.",
  },
  {
    title: "Ensure Fair Access",
    description:
      "By throttling the number of requests a single user can make, we ensure fair access for all users, preventing one user from monopolizing resources.",
  },
  {
    title: "Manage Infrastructure Load",
    description:
      "Rate limits help us maintain a smooth and consistent experience by preventing excessive load on our servers.",
  },
];

const rateLimitTypes = [
  {
    title: "RPM (Requests Per Minute)",
    description: "The number of API requests allowed per minute.",
  },
  {
    title: "RPD (Requests Per Day)",
    description: "The number of API requests allowed per day.",
  },
  {
    title: "TPM (Tokens Per Minute)",
    description: "The number of tokens processed per minute.",
  },
  {
    title: "TPD (Tokens Per Day)",
    description: "The number of tokens processed per day.",
  },
  {
    title: "IPM (Images Per Minute)",
    description: "The number of images generated per minute.",
  },
  {
    title: "VPM (Videos Per Minute)",
    description: "The number of videos generated per minute.",
  },
  {
    title: "APM (Audio Files Per Minute)",
    description: "The number of audio files generated per minute.",
  },
];

const keyNotes = [
  {
    title: "Organization-Level Limits",
    description:
      "Rate limits are defined at the organization level, not the user level.",
  },
  {
    title: "Model-Specific Limits",
    description:
      "Different models (e.g., chat, image, audio, video) may have unique rate limits.",
  },
  {
    title: "Shared Limits",
    description:
      "Some model families share rate limits. For example, all chat models might share a TPM limit.",
  },
  {
    title: "Usage Limits",
    description:
      "In addition to rate limits, there are monthly usage limits based on your subscription tier.",
  },
];

const errorMitigationSteps = [
  {
    title: "Retry with Exponential Backoff",
    description:
      "Automatically retry requests with a random exponential backoff.",
  },
  {
    title: "Reduce max_tokens",
    description:
      "Set the max_tokens parameter as close to your expected response size as possible.",
  },
  {
    title: "Batch Requests",
    description: "Use the Batch API to submit multiple requests at once.",
  },
  {
    title: "Monitor Usage",
    description: "Regularly check your usage and rate limits in the headers.",
  },
];

// Reusable Components
const Table = ({ headers, children, className = "" }) => (
  <div className={`overflow-x-auto mb-8 ${className}`}>
    <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
      <thead className="">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="py-3 px-4 text-left text-sm font-semibold  border-x border-gray-200"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className=" divide-y divide-gray-200">{children}</tbody>
    </table>
  </div>
);

const ModelLimitsTable = ({ modelType, data }) => {
  const renderRow = (model) => {
    const values = Object.values(model);
    return (
      <tr key={model.name} className="hover:bg-accent">
        {values.map((value, index) => (
          <td
            key={index}
            className="py-3 px-4 text-sm  border-x border-gray-200"
          >
            {value}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">{data.title}</h3>
      <Table headers={data.headers}>
        {data.models.map((model) => renderRow(model))}
      </Table>
    </>
  );
};

const ListSection = ({ items }) => (
  <ul className="text-muted-foreground mb-8 space-y-4">
    {items.map((item, index) => (
      <li key={index}>
        <strong className="">{item.title}:</strong> {item.description}
      </li>
    ))}
  </ul>
);

const RateLimits = () => {
  return (
    <div className="documentation-container">
      <p className="text-muted-foreground mb-8">
        Understand API rate limits and restrictions for [Your Website Name].
        Rate limits are restrictions that our API imposes on the number of times
        a user or client can access our services within a specified period of
        time.
      </p>

      <h2 className="text-3xl mb-4">Why Do We Have Rate Limits?</h2>
      <p className="text-muted-foreground mb-8">
        Rate limits are a common practice for APIs, and they're put in place for
        a few key reasons:
      </p>
      <ListSection items={rateProtectionReasons} />

      <h2 className="text-3xl mb-4">How Do Rate Limits Work?</h2>
      <p className="text-muted-foreground mb-8">
        Rate limits on [Your Website Name] are measured in the following ways:
      </p>
      <ListSection items={rateLimitTypes} />

      <h2 className="text-3xl mb-4">Key Notes About Rate Limits</h2>
      <ListSection items={keyNotes} />

      <h2 className="text-3xl mb-4">Usage Tiers</h2>
      <p className="text-muted-foreground mb-8">
        As your usage increases, you'll automatically graduate to higher usage
        tiers, which come with increased rate limits. Below is a summary of our
        tiers:
      </p>
      <Table headers={["Tier", "Qualification", "Usage Limits"]}>
        {usageTiersData.map((tier) => (
          <tr key={tier.tier} className="hover:bg-accent">
            <td className="py-3 px-4 text-sm  font-medium border-x border-gray-200">
              {tier.tier}
            </td>
            <td className="py-3 px-4 text-sm  border-x border-gray-200">
              {tier.qualification}
            </td>
            <td className="py-3 px-4 text-sm  border-x border-gray-200">
              {tier.usageLimits}
            </td>
          </tr>
        ))}
      </Table>

      <h2 className="text-3xl mb-4">Rate Limits by Model</h2>
      <p className="text-muted-foreground mb-8">
        Below is a high-level summary of rate limits for some of our most
        popular models:
      </p>

      {Object.entries(modelLimitsData).map(([type, data]) => (
        <ModelLimitsTable key={type} modelType={type} data={data} />
      ))}

      <h2 className="text-3xl mb-4">Rate Limits in Headers</h2>
      <p className="text-muted-foreground mb-8">
        You can monitor your rate limits directly from the headers of API
        responses. Here are the key headers to look for:
      </p>
      <Table headers={["Header Field", "Sample Value", "Description"]}>
        {headerData.map((header) => (
          <tr key={header.field} className="hover:bg-accent">
            <td className="py-3 px-4 text-sm font-mono  border-x border-gray-200">
              {header.field}
            </td>
            <td className="py-3 px-4 text-sm  border-x border-gray-200">
              {header.value}
            </td>
            <td className="py-3 px-4 text-sm  border-x border-gray-200">
              {header.description}
            </td>
          </tr>
        ))}
      </Table>

      <h2 className="text-3xl mb-4">Error Mitigation</h2>
      <h3 className="text-xl mb-4">
        What Should You Do If You Hit a Rate Limit?
      </h3>
      <ListSection items={errorMitigationSteps} />

      <h2 className="text-3xl mb-4">Need Help?</h2>
      <p className="text-muted-foreground mb-8">
        If you have questions or need assistance with rate limits, contact our
        support team at <strong>[support email]</strong> or visit our{" "}
        <strong>[Help Center]</strong>.
      </p>
      <NavigationContainer
        previousTitle="Prompt Examples"
        previousDescription="Learn about fine-tunning inputs"
        preUrl="/docs/user-guides/prompts"
        nextTitle="Error Codes"
        nextDesciption="Learn about error handlings"
        nextUrl="/docs/user-guides/error-codes"
      />
    </div>
  );
};

export default RateLimits;
