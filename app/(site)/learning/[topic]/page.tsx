import { permanentRedirect } from "next/navigation";

type TopicRedirectProps = {
  params: Promise<{ topic: string }>;
};

/** /learning/<topic> → /notes/<topic>（集合 id 不变，直接透传；308 见 DEC-059）。 */
export default async function LearningTopicRedirect({ params }: TopicRedirectProps) {
  const { topic } = await params;
  permanentRedirect(`/notes/${topic}`);
}
