import { Metadata } from "next";
import TeamMemberClient from "../../TeamMemberClient";

export const metadata: Metadata = {
  title: "Jal Lad - Product Designer & Community Lead | Skill Sphere",
  description: "Learn more about Jal Lad, Product Designer & Community Lead at Skill Sphere.",
};

export default function Page() {
  return <TeamMemberClient slug="jal-lad" />;
}
