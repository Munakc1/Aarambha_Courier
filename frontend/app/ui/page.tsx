"use client";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Field,
  Input,
  PasswordInput,
  Select,
  Stack,
  Switch,
  useToast,
} from "@lacspace/components";

// Everything below is real: a form that validates, a dialog that waits for its
// promise, and a toast queue — none of it styled with utility classes. The look
// comes from app/lacspace-ui.css, which maps this template's tokens onto the kit.
export default function UIPage() {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [updates, setUpdates] = useState(true);
  const [errors, setErrors] = useState<{ email?: string }>({});

  function save(form: FormData) {
    const email = String(form.get("email") ?? "");
    if (!email.includes("@")) {
      setErrors({ email: "That doesn't look like an email address." });
      return;
    }
    setErrors({});
    toast({ title: "Settings saved", tone: "success" });
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Stack gap={4}>
        <Card>
          <CardHeader>
            <CardTitle>Account settings</CardTitle>
            <CardDescription>
              96 components from @lacspace/components — accessible, server-render safe, and
              themed by CSS variables instead of utility classes.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <form action={save}>
              <Stack gap={3}>
                <Field label="Work email" hint="We never share it." error={errors.email}>
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="email"
                      type="email"
                      defaultValue="you@company.com"
                      aria-describedby={describedBy}
                      invalid={invalid}
                    />
                  )}
                </Field>

                <Field label="New password" hint="At least 12 characters.">
                  {({ id, describedBy }) => (
                    <PasswordInput id={id} name="password" aria-describedby={describedBy} strength />
                  )}
                </Field>

                <Field label="Plan">
                  {({ id }) => (
                    <Select
                      id={id}
                      name="plan"
                      defaultValue="pro"
                      options={[
                        { value: "free", label: "Free" },
                        { value: "pro", label: "Pro" },
                        { value: "team", label: "Team" },
                      ]}
                    />
                  )}
                </Field>

                <Switch checked={updates} onChange={setUpdates} label="Email me about product updates" />

                <Button type="submit" full>
                  Save changes
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>

        <Alert tone="info" title="Rebrand the whole kit from one file">
          Open <code>app/lacspace-ui.css</code>. It maps this template&rsquo;s accent, radius and font
          onto the kit&rsquo;s variables, so the components already match — and they follow your
          existing dark-mode toggle.
        </Alert>

        <Card>
          <CardBody>
            <Stack direction="row" gap={2} align="center" wrap>
              <Badge tone="success" dot>
                Live
              </Badge>
              <Button variant="soft" onClick={() => toast("Saved to drafts")}>
                Show a toast
              </Button>
              <Button tone="danger" variant="soft" onClick={() => setConfirming(true)}>
                Delete account
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        tone="danger"
        title="Delete this account?"
        message="Everything in it goes with it. This cannot be undone."
        confirmLabel="Delete account"
        onConfirm={async () => {
          // Return a promise and the button spins, blocks repeat clicks, and
          // keeps the dialog open if it rejects — a failed delete never looks
          // like a successful one.
          await new Promise((resolve) => setTimeout(resolve, 700));
          toast({ title: "Account deleted", tone: "success" });
        }}
      />
    </main>
  );
}
