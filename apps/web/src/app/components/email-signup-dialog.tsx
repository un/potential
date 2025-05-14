"use client";

import { useState } from "react";
import { Envelope } from "@phosphor-icons/react/dist/ssr";

import { subscribe } from "~/app/actions/subscribe";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";

export function EmailSignupDialog() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await subscribe(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setEmail("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <div className="flex flex-row items-center gap-2">
            Get updates
            <Envelope />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stay Updated</DialogTitle>
          <DialogDescription>
            Enter your email to receive updates about new features and releases.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
