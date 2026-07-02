import { redirect } from "next/navigation";

export default function QAForumRedirect() {
  redirect("/dashboard/teacher/community?tab=discussions");
}
