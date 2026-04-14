"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettingsData {
  id: string;
  businessName: string;
  practitionerName: string;
  email: string;
  phone: string;
  address: string;
  defaultDuration: number;
  defaultType: string;
  defaultRate: number;
  paymentTerms: string;
  paymentDetails: string;
}

export function SettingsForm({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      businessName: form.get("businessName"),
      practitionerName: form.get("practitionerName"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      defaultDuration: parseInt(form.get("defaultDuration") as string),
      defaultType: form.get("defaultType"),
      defaultRate: parseFloat(form.get("defaultRate") as string),
      paymentTerms: form.get("paymentTerms"),
      paymentDetails: form.get("paymentDetails"),
    };

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (res.ok) {
      toast.success("Settings saved");
      router.refresh();
    } else {
      toast.error("Failed to save settings");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={settings.businessName}
            />
          </div>
          <div>
            <Label htmlFor="practitionerName">Practitioner Name</Label>
            <Input
              id="practitionerName"
              name="practitionerName"
              defaultValue={settings.practitionerName}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={settings.email}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={settings.phone}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={settings.address}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Session Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="defaultDuration">Duration (min)</Label>
              <Input
                id="defaultDuration"
                name="defaultDuration"
                type="number"
                defaultValue={settings.defaultDuration}
              />
            </div>
            <div>
              <Label>Session Type</Label>
              <Select name="defaultType" defaultValue={settings.defaultType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultRate">Rate (CAD)</Label>
              <Input
                id="defaultRate"
                name="defaultRate"
                type="number"
                step="0.01"
                defaultValue={settings.defaultRate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Invoice Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Textarea
              id="paymentTerms"
              name="paymentTerms"
              rows={2}
              defaultValue={settings.paymentTerms}
            />
          </div>
          <div>
            <Label htmlFor="paymentDetails">Payment Details</Label>
            <Textarea
              id="paymentDetails"
              name="paymentDetails"
              rows={2}
              placeholder="E-transfer details, bank info, etc."
              defaultValue={settings.paymentDetails}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
