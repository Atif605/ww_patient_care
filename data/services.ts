import type { Service } from "@/types"

/**
 * Services offered.
 *
 * ⚠️ IMPORTANT
 * - Only list services the business actually provides.
 * - Do NOT fabricate features, certifications, or medical claims.
 * - Every `[PLACEHOLDER: ...]` must be replaced before launch.
 * - `icon` values must match the keys in `components/sections/ServicesGrid.tsx`
 *   (stethoscope, heart-pulse, users, activity, bed, hand-heart).
 */
export const services: Service[] = [
  // ─────────────────────────────────────────────────────────
  // 1. Home Nursing Care
  // ─────────────────────────────────────────────────────────
  {
    slug: "home-nursing-care",
    title: "Home Nursing Care",
    shortDescription: "Professional nursing care in the comfort of your home.",
    description:
      "Our nursing staff provides compassionate care tailored to the patient's needs, right at home.",
    icon: "stethoscope",
    features: [
      "[PLACEHOLDER: Vitals monitoring]",
      "[PLACEHOLDER: Medication reminders]",
      "[PLACEHOLDER: Wound care assistance]",
    ],
    faqs: [
      {
        question: "What does home nursing care include?",
        answer:
          "It includes assistance with daily medical needs, coordinated with your doctor's guidance and delivered by our nursing staff. Please share your specific requirements when you inquire.",
      },
    ],
    metaTitle: "Home Nursing Care in Karachi | WW Patient Care",
    metaDescription:
      "Professional and compassionate home nursing care services in Karachi. Let our team support your loved one's health at home.",
  },

  // ─────────────────────────────────────────────────────────
  // 2. Patient Care at Home
  // ─────────────────────────────────────────────────────────
  {
    slug: "patient-care-at-home",
    title: "Patient Care at Home",
    shortDescription: "Comprehensive care for patients recovering at home.",
    description:
      "We provide supportive care to help patients maintain comfort and dignity while recovering or managing illness at home.",
    icon: "heart-pulse",
    features: [
      "[PLACEHOLDER: Assistance with daily living]",
      "[PLACEHOLDER: Mobility support]",
      "[PLACEHOLDER: Companionship]",
    ],
    faqs: [
      {
        question: "Is patient care available daily?",
        answer:
          "[PLACEHOLDER: Confirm actual scheduling — daily / hourly / shift-based. Do not claim availability that isn't real.]",
      },
    ],
    metaTitle: "Patient Care at Home in Karachi | WW Patient Care",
    metaDescription:
      "Reliable patient care services at home in Karachi. Professional caregivers focused on your loved one's comfort.",
  },

  // ─────────────────────────────────────────────────────────
  // 3. Elderly Care
  // ─────────────────────────────────────────────────────────
  {
    slug: "elderly-care",
    title: "Elderly Care",
    shortDescription: "Respectful and attentive care for seniors.",
    description:
      "Our elderly care services focus on providing a safe, comfortable, and engaging environment for seniors living at home.",
    icon: "users",
    features: [
      "[PLACEHOLDER: Personal hygiene assistance]",
      "[PLACEHOLDER: Meal preparation help]",
      "[PLACEHOLDER: Safe mobility assistance]",
    ],
    faqs: [
      {
        question: "Do you provide companionship for seniors?",
        answer:
          "[PLACEHOLDER: Confirm whether companionship is part of the service. Do NOT claim 'trained' unless documented.]",
      },
    ],
    metaTitle: "Elderly Care Services in Karachi | WW Patient Care",
    metaDescription:
      "Compassionate elderly care services in Karachi. Ensure your senior family members live safely and comfortably at home.",
  },

  // ─────────────────────────────────────────────────────────
  // 4. Post-Hospitalization Care
  // ─────────────────────────────────────────────────────────
  {
    slug: "post-hospitalization-care",
    title: "Post-Hospitalization Care",
    shortDescription:
      "Support during the critical transition from hospital to home.",
    description:
      "We help manage the transition from hospital to home, providing the necessary support during recovery.",
    icon: "activity",
    features: [
      "[PLACEHOLDER: Recovery monitoring]",
      "[PLACEHOLDER: Assistance following discharge instructions]",
      "[PLACEHOLDER: Comfort support]",
    ],
    faqs: [
      {
        question: "When should we arrange post-hospitalization care?",
        answer:
          "It is best to contact us before the patient is discharged so we can prepare the necessary support in advance.",
      },
    ],
    metaTitle: "Post-Hospitalization Care in Karachi | WW Patient Care",
    metaDescription:
      "Smooth transition from hospital to home with our post-hospitalization care services in Karachi.",
  },

  // ─────────────────────────────────────────────────────────
  // 5. Bedridden Patient Care
  // ─────────────────────────────────────────────────────────
  {
    slug: "bedridden-patient-care",
    title: "Bedridden Patient Care",
    shortDescription: "Specialized care for individuals confined to bed.",
    description:
      "Our caregivers assist bedridden patients with their specific needs, focusing on hygiene, comfort, and dignity.",
    icon: "bed",
    features: [
      "[PLACEHOLDER: Position changing assistance]",
      "[PLACEHOLDER: Bed bath and hygiene]",
      "[PLACEHOLDER: Feeding assistance]",
    ],
    faqs: [
      {
        question: "How do you support the comfort of bedridden patients?",
        answer:
          "Our team follows routines for regular position changes, hygiene maintenance, and careful attention to the patient's comfort. We coordinate with the family and, where applicable, the treating doctor.",
      },
    ],
    metaTitle: "Bedridden Patient Care in Karachi | WW Patient Care",
    metaDescription:
      "Dedicated care for bedridden patients in Karachi. Supporting hygiene, comfort, and dignity at home.",
  },

  // ─────────────────────────────────────────────────────────
  // 6. Caregiver Services
  // ─────────────────────────────────────────────────────────
  {
    slug: "caregiver-services",
    title: "Caregiver Services",
    shortDescription: "Dedicated caregivers for daily assistance and support.",
    description:
      "We match your family with caregivers who assist with daily routines, supporting a safe and comfortable home environment.",
    icon: "hand-heart",
    features: [
      "[PLACEHOLDER: Flexible scheduling]",
      "[PLACEHOLDER: Daily routine support]",
      "[PLACEHOLDER: Companionship]",
    ],
    faqs: [
      {
        question: "Can we meet the caregiver beforehand?",
        answer:
          "[PLACEHOLDER: Confirm whether pre-meeting is offered. Do not promise it if it isn't standard.]",
      },
    ],
    metaTitle: "Professional Caregiver Services in Karachi | WW Patient Care",
    metaDescription:
      "Hire professional and compassionate caregivers in Karachi for your loved ones. Support for daily routines at home.",
  },
]