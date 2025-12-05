// src/components/page/contact-form.tsx
"use client";
import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type FormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  // Note: 'plan' won't be part of formData if it's dynamically added to the message string
};

export type ContactFormVariant = "full" | "maintenance";

interface ContactFormProps {
  variant: ContactFormVariant;
  serviceType?: "React" | "WordPress"; // Optional prop for maintenance forms
  plusPlanLabel?: "Performance" | "SEO"; // New prop for the "Plus" plan label
  delay?: number;
  className?: string;
  id?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  variant,
  serviceType,
  plusPlanLabel, // Destructure new prop
  delay = 0.2,
  className,
  id,
}) => {
  const createMessage = useMutation(api.contactMessages.create);

  const defaultBasicMessage = `I'm interested in your ${serviceType} maintenance services. Could you tell me more?`;
  const defaultPlusMessage = `I'm interested in "The Action Plan (With ${plusPlanLabel})" for your ${serviceType} maintenance services. Could you tell me more?`;

  const [selectedPlan, setSelectedPlan] = useState<"basic" | "plus">("basic"); // New state for plan selection

  // Memoized initial message based on variant, serviceType, and selectedPlan
  const initialMessage = useMemo(() => {
    if (variant === "maintenance" && serviceType) {
      return selectedPlan === "basic"
        ? defaultBasicMessage
        : defaultPlusMessage;
    }
    return ""; // Default empty message for the full form
  }, [
    variant,
    serviceType,
    selectedPlan,
    defaultBasicMessage,
    defaultPlusMessage,
  ]); // Added default messages to dependencies

  // Helper to determine the source for Convex based on variant and serviceType
  const getSource = (
    currentVariant: ContactFormVariant,
    currentServiceType?: "React" | "WordPress"
  ) => {
    if (currentVariant === "maintenance" && currentServiceType) {
      return `${currentServiceType.toLowerCase()}-maintenance-page`;
    }
    return "contact-page"; // Default source for the full form
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: initialMessage, // Initialized correctly
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Update the message in formData whenever initialMessage changes (e.g., plan selection changes)
    setFormData((prev) => ({
      ...prev,
      message: initialMessage,
    }));
  }, [initialMessage]); // Depend on initialMessage to trigger update

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const finalSource = getSource(variant, serviceType);

      await createMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        message: formData.message.trim(), // Use the current formData.message, which is kept in sync
        source: finalSource,
      });
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: initialMessage, // CORRECTED: Use the memoized initialMessage here
      });
      setErrors({});
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <motion.div
      id={id} // PASSED HERE: id prop
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`${variant === "full" ? "mt-8" : ""} ${className || ""}`}
    >
      <Card size="full">
        <form onSubmit={handleSubmitInternal} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2">
              Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block mb-2">
              Email *
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-red-500">{errors.email}</p>
            )}
          </div>
          {/* Phone field only for 'full' contact form variant */}
          {variant === "full" && (
            <div>
              <label htmlFor="phone" className="block mb-2">
                Phone (optional)
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="mt-1 text-red-500">{errors.phone}</p>
              )}
            </div>
          )}

          {/* Plan selection for maintenance forms */}
          {variant === "maintenance" && serviceType && plusPlanLabel && (
            <div>
              <label className="block mb-2">Choose An Action Plan</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    checked={selectedPlan === "basic"}
                    onChange={() => setSelectedPlan("basic")}
                    className="text-accent"
                  />
                  <span className="">The Action Plan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    value="plus"
                    checked={selectedPlan === "plus"}
                    onChange={() => setSelectedPlan("plus")}
                    className="text-accent"
                  />
                  <span className="">
                    The Action Plan Plus (With {plusPlanLabel})
                  </span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="message" className="block mb-2">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={variant === "full" ? 6 : 3} // Dynamic rows based on variant
              className={errors.message ? "border-red-500" : ""}
              placeholder={
                variant === "full"
                  ? "Tell me about your project or inquiry..."
                  : "I'm interested in your services..."
              }
            />
            {errors.message && (
              <p className="mt-1 text-red-500">{errors.message}</p>
            )}
            {/* Character count only for 'full' contact form variant */}
            {variant === "full" && (
              <p className="mt-1 text-sm text-muted">
                {formData.message.length} characters
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="base"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-500"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="">Message sent successfully!</span>
            </motion.div>
          )}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-500"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="">
                Failed to send message. Please try again.
              </span>
            </motion.div>
          )}
        </form>
      </Card>
    </motion.div>
  );
};

export default ContactForm;
