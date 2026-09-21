import { PageHeader } from "@/components/admin/form";
import { MessagesList } from "@/components/admin/messages-list";
import { getAdminMessages } from "@/lib/admin-data";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-6">
      <PageHeader
        title="Messages"
        description="Inbound notes from the public contact form. Reply from your email client; deleting is permanent."
      />
      <MessagesList
        key={messages.map((item) => `${item.id}:${item.readAt?.toISOString() ?? "unread"}`).join("|")}
        messages={messages}
      />
    </main>
  );
}
