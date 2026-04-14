import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your business information and defaults.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
