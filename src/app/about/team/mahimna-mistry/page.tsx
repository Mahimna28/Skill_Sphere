import { Metadata } from "next";
import TeamMemberClient from "../../TeamMemberClient";

export const metadata: Metadata = {
  title: "Mahimna Mistry - Founder & Lead Developer | Skill Sphere",
  description: "Learn more about Mahimna Mistry, Founder & Lead Developer at Skill Sphere.",
};

export default function Page() {
  return <TeamMemberClient slug="mahimna-mistry" />;
}
