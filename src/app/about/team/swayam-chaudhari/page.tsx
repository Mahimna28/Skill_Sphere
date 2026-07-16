import { Metadata } from "next";
import TeamMemberClient from "../../TeamMemberClient";

export const metadata: Metadata = {
  title: "Swayam Chaudhari - Frontend Developer | Skill Sphere",
  description: "Learn more about Swayam Chaudhari, Frontend Developer at Skill Sphere.",
};

export default function Page() {
  return <TeamMemberClient slug="swayam-chaudhari" />;
}
