import type { Metadata } from "next";
import { KziWizard } from "@/components/KziWizard/KziWizard";
export const metadata: Metadata = { title: "Самооценка КЗИ — CheckU", robots: { index: false, follow: false } };
export default function AssessmentPage() {
  return <main><KziWizard /></main>;
}
