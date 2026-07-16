import { Metadata } from "next";
import TeamMemberClient from "../../TeamMemberClient";

export const metadata: Metadata = {
  title: "Dev Patel - Backend Engineer | Skill Sphere",
  description: "Learn more about Dev Patel, Backend Engineer at Skill Sphere.",
};

export default function Page() {
  return <TeamMemberClient slug="dev-patel" />;
}
