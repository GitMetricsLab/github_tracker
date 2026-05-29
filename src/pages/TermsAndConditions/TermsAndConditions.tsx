import LegalPageLayout from "../../components/legal/LegalPageLayout";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using GitHub Tracker, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.",
  },
  {
    title: "Use of Service",
    content:
      "GitHub Tracker is provided for personal and professional use to track GitHub activity. You agree not to misuse the service, attempt unauthorized access, or use it for any unlawful purpose.",
  },
  {
    title: "GitHub API Usage",
    content:
      "Our service relies on the public GitHub API. Usage is subject to GitHub's Terms of Service and API rate limits. We are not affiliated with or endorsed by GitHub, Inc.",
  },
  {
    title: "User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content, design, and code within GitHub Tracker is the intellectual property of its contributors. You may not reproduce or distribute any part of the service without explicit permission.",
  },
  {
    title: "Disclaimer of Warranties",
    content:
      "GitHub Tracker is provided as-is without warranties of any kind. We do not guarantee uninterrupted or error-free service and are not liable for any data loss or damages.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes your acceptance of the new terms.",
  },
];

const TermsAndConditions = () => (
  <LegalPageLayout
    title="Terms & Conditions"
    intro="Please read these Terms and Conditions carefully before using GitHub Tracker. These terms govern your use of our service and constitute a legal agreement between you and GitHub Tracker."
    sections={sections}
  />
);

export default TermsAndConditions;