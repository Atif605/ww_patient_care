import type { FAQ } from "@/types"

/**
 * Global FAQs shown on the FAQ page and homepage FAQ section.
 *
 * ⚠️ Every answer containing `[PLACEHOLDER: ...]` is a stub.
 * The owner must replace it with the real, verified answer before launch.
 *
 * Do NOT make medical claims, guarantee outcomes, or claim certifications
 * that the business does not actually have.
 */
export const globalFaqs: FAQ[] = [
  {
    question: "What areas do you serve?",
    answer:
      "We currently provide home patient care services across Karachi. Please contact us to confirm availability in your specific area.",
  },
  {
    question: "How do I request care for a family member?",
    answer:
      "You can request care by filling out the form on our website, calling us directly, or sending us a message on WhatsApp.",
  },
  {
    question: "Are your caregivers trained?",
    answer:
      "[PLACEHOLDER: Confirm and describe real training — do NOT claim certifications unless documented.]",
  },
  {
    question: "What are your operating hours?",
    answer:
      "[PLACEHOLDER: Provide actual operating hours, e.g., Monday–Saturday, 9:00 AM – 9:00 PM.]",
  },
  {
    question: "Do you offer emergency medical services?",
    answer:
      "No. We do not provide emergency medical services. In case of a medical emergency, please call an ambulance or visit the nearest hospital immediately.",
  },
  {
    question: "Can we arrange a short-term care service?",
    answer:
      "[PLACEHOLDER: Confirm whether short-term care is offered, and describe typical durations.]",
  },
  {
    question: "How quickly can a caregiver start?",
    answer:
      "[PLACEHOLDER: Provide realistic timelines based on actual staffing capacity.]",
  },
  {
    question: "Do you provide medical equipment?",
    answer:
      "[PLACEHOLDER: Confirm whether the business supplies equipment or only staffing.]",
  },
]