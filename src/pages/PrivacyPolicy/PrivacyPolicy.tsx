import LegalPageLayout from "../../components/legal/LegalPageLayout";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, such as your GitHub username when using our tracker. We also collect usage data including pages visited and features used to improve our service.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use collected information to provide and improve our services, respond to your requests, and send relevant updates. We do not sell your personal information to third parties.",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is stored securely using industry-standard encryption. We retain your information only as long as necessary to provide our services or as required by law.",
  },
  {
    title: "Third-Party Services",
    content:
      "GitHub Tracker uses the public GitHub API to fetch repository and contribution data. We are not responsible for GitHub's privacy practices. Please review GitHub's Privacy Policy for more information.",
  },
  {
    title: "Cookies",
    content:
      "We use session cookies to manage authentication. These cookies are essential for the service to function and are deleted when you close your browser or log out.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us through the Contact page.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.",
  },
];

const PrivacyPolicy = () => (
  <LegalPageLayout
    title="Privacy Policy"
    intro="At GitHub Tracker, we are committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your data."
    sections={sections}
  />
);

export default PrivacyPolicy;