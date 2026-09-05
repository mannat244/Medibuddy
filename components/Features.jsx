import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    title: "Ingredients",
    description: "See the active substances listed for each FDA label.",
    details: ["Active ingredients", "Strength where available", "Ingredient names"],
  },
  {
    title: "Dosage and safety",
    description: "Read the directions and warnings supplied with the selected label.",
    details: ["Dosage directions", "Uses and indications", "Warnings and precautions"],
  },
  {
    title: "Medicine details",
    description: "Review the product information needed to compare label records.",
    details: ["Manufacturer", "Route and product type", "FDA label metadata"],
  },
];

const faqs = [
  {
    question: "What can I search for?",
    answer: "Search by a medicine brand name, such as Advil, Aspirin, or Paracetamol. Suggestions appear after you type at least two characters.",
  },
  {
    question: "Where does the medicine information come from?",
    answer: "Medibuddy reads medicine label records from the public openFDA Drug Label API. The records are from the United States FDA.",
  },
  {
    question: "Why can one brand have several results?",
    answer: "A brand can have different formulations, strengths, routes, packages, or manufacturers. Each result represents a separate FDA label record.",
  },
  {
    question: "Is this medical advice?",
    answer: "No. Medibuddy is an information and label-search tool. Read the product label and consult a doctor or pharmacist for medical decisions.",
  },
];

const Features = () => {
  return (
    <div id="features" className="mx-auto max-w-5xl px-6 pb-16">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight">
          Understand your <span className="text-red-600">medicine</span> with clarity.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Explore the label information that matters before you make a decision.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="h-full transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {feature.details.map((detail) => (
                  <li key={detail} className="border-t pt-2 first:border-t-0 first:pt-0">
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="about" className="mt-16">
        <div className="mb-5 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">
            Questions before you <span className="text-red-600">search?</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Quick answers about the medicine labels and information in Medibuddy.
          </p>
        </div>
        <Accordion className="bg-card">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="leading-6 text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default Features
