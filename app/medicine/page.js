"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ClipboardList,
  Database,
  Info,
  Pill,
  TriangleAlert,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const getValue = (values) => values?.join("\n") || "Not available";
const getFirstValue = (values) => values?.[0] || "Not available";
const getMatches = (values, pattern) =>
  [...new Set((values || []).flatMap((value) => value.match(pattern) || []))];
const formatLabelText = (values) =>
  values?.filter(Boolean).map((value) => value
    .replace(/&amp;/g, "&")
    .replace(/\u200b/g, "")
    .replace(/^(active ingredients?|purposes?|uses|warnings|directions)\s+/i, "")
    .replace(/\s*[•]\s*/g, "\n• ")
    .replace(/\s+(?=(?:Ask a doctor|Do not use|When using|Stop use|Keep out of reach|If pregnant))/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
  ).join("\n\n") || "Not available";

const getIngredientCards = (values) =>
  values?.filter(Boolean).map((value) => {
    const cleanedValue = value.replace(/&amp;/g, "&").replace(/\s*\*.*$/, "");
    const strength = cleanedValue.match(/\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|%)\b/i)?.[0];
    const name = cleanedValue
      .replace(/^(active ingredients?|active ingredient)\s*/i, "")
      .replace(/\s+\d+(?:\.\d+)?\s?(?:mg|mcg|g|%)\b.*$/i, "")
      .trim();

    return { name, strength: strength || "Strength not listed" };
  }) || [];

const MedicineDetailsPage = () => {
  const router = useRouter();
  const [medicine, setMedicine] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const recordId = new URLSearchParams(window.location.search).get("id");

    if (!recordId) {
      setStatus("error");
      return;
    }

    const apiUrl = `https://api.fda.gov/drug/label.json?search=id:"${encodeURIComponent(recordId)}"&limit=1`;
    const controller = new AbortController();
    let isActive = true;

    const getMedicine = async () => {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        const data = await response.json();

        if (!isActive) {
          return;
        }

        if (!response.ok || !data.results?.[0]) {
          throw new Error("Medicine not found");
        }

        setMedicine(data.results[0]);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError" && isActive) {
          setStatus("error");
        }
      }
    };

    getMedicine();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-6 py-12">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="mt-6 h-40 w-full" />
        </main>
        <Footer />
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-6 py-12">
          <p>Medicine details could not be loaded.</p>
          <Button className="mt-4" onClick={() => router.back()}>Back to results</Button>
        </main>
        <Footer />
      </>
    );
  }

  const { openfda = {} } = medicine;
  const ingredientCards = getIngredientCards(medicine.active_ingredient);
  const ingredientClass = getFirstValue(openfda.pharm_class_epc).includes("Nonsteroidal")
    ? "NSAID"
    : "Active ingredient";
  const strengths = getMatches(medicine.active_ingredient, /\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|%)\b/gi);
  const labelDate = medicine.effective_time
    ? `${medicine.effective_time.slice(4, 6)}/${medicine.effective_time.slice(6, 8)}/${medicine.effective_time.slice(0, 4)}`
    : "Not available";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/search">Medicines</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{getFirstValue(openfda.brand_name)}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button className="mt-6" variant="outline" onClick={() => router.back()}>
          Back to results
        </Button>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-3xl">{getFirstValue(openfda.brand_name)}</CardTitle>
            <p className="max-w-3xl text-muted-foreground">{getValue(medicine.active_ingredient)}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline">{getFirstValue(openfda.route)}</Badge>
              <Badge variant="secondary">{getFirstValue(openfda.product_type)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Purpose:</span>{" "}
              {getValue(medicine.purpose)}
            </p>
          </CardContent>
        </Card>

        <div className="mt-4 flex items-center gap-2 rounded-md border bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <BadgeCheck className="size-5 text-emerald-600" />
          <span className="font-semibold">Genuine label information</span>
          <span className="text-slate-500">Sourced from official FDA records</span>
        </div>

        <Alert className="mt-6 border-amber-200 bg-amber-50 text-amber-950">
          <Info />
          <AlertTitle>FDA label information</AlertTitle>
          <AlertDescription>
            This information comes from the US FDA Drug Label API. Always verify the current label and consult a healthcare professional.
          </AlertDescription>
        </Alert>

        <Card className="mt-6">
          <CardHeader>
            <SectionHeading icon={Pill} color="text-blue-600" title="At a glance" />
          </CardHeader>
          <CardContent>
            <DetailRow title="Active ingredients" value={getValue(openfda.substance_name)} />
            <Separator />
            <DetailRow title="Strength" value={strengths.join(" + ") || "Not available"} />
            <Separator />
            <DetailRow title="Dosage form" value={getFirstValue(openfda.dosage_form)} />
            <Separator />
            <DetailRow title="Route" value={getValue(openfda.route)} />
            <Separator />
            <DetailRow title="Product type" value={getValue(openfda.product_type)} />
            <Separator />
            <DetailRow title="Manufacturer" value={getValue(openfda.manufacturer_name)} />
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-4">
            <SectionHeading icon={Pill} color="text-blue-600" title="Active ingredients" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ingredientCards.map((ingredient, index) => (
              <Card key={`${ingredient.name}-${index}`}>
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <CardTitle className="text-base leading-6">{ingredient.name}</CardTitle>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    {ingredient.strength}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{ingredientClass}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <SectionHeading icon={ClipboardList} color="text-amber-600" title="Directions and uses" />
          </div>
          <Card>
            <CardContent className="space-y-5 pt-6">
              <Detail title="Dosage and directions" value={formatLabelText(medicine.dosage_and_administration)} />
              <p className="text-xs text-muted-foreground">Follow the directions on your specific product label and consult a doctor or pharmacist when needed.</p>
              <Separator />
              <Detail title="Uses and indications" value={formatLabelText(medicine.indications_and_usage)} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="size-5 text-red-600" />
            <h2 className="text-2xl font-bold text-red-950">Safety information</h2>
          </div>
          <Accordion className="border-destructive/30 bg-card">
            <AccordionItem value="warnings" className="data-open:bg-red-50/50">
              <AccordionTrigger>Important warnings</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.warnings)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="do-not-use" className="data-open:bg-red-50/50">
              <AccordionTrigger>Do not use</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.do_not_use)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="ask-doctor" className="data-open:bg-red-50/50">
              <AccordionTrigger>Ask a doctor before use</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.ask_doctor)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="ask-pharmacist" className="data-open:bg-red-50/50">
              <AccordionTrigger>Ask a doctor or pharmacist</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.ask_doctor_or_pharmacist)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="when-using" className="data-open:bg-red-50/50">
              <AccordionTrigger>When using this product</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.when_using)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="pregnancy" className="data-open:bg-red-50/50">
              <AccordionTrigger>Pregnancy or breastfeeding</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.pregnancy_or_breast_feeding)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="stop-use" className="data-open:bg-red-50/50">
              <AccordionTrigger>When to stop use</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.stop_use)}</p></AccordionContent>
            </AccordionItem>
            <AccordionItem value="children" className="data-open:bg-red-50/50">
              <AccordionTrigger>Keep out of reach of children</AccordionTrigger>
              <AccordionContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{formatLabelText(medicine.keep_out_of_reach_of_children)}</p></AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Card className="mt-8">
          <CardHeader>
            <SectionHeading icon={Pill} color="text-slate-600" title="Other ingredients" />
          </CardHeader>
          <CardContent>
            <Detail title="Inactive ingredients" value={formatLabelText(medicine.inactive_ingredient)} />
          </CardContent>
        </Card>

        <Accordion className="mt-8 bg-card">
          <AccordionItem value="metadata">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Database className="size-4 text-slate-500" />
                Label information and source metadata
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-x-8 md:grid-cols-2">
                <DetailRow title="Label effective date" value={labelDate} />
                <DetailRow title="Label version" value={medicine.version || "Not available"} />
                <DetailRow title="Application number" value={getValue(openfda.application_number)} />
                <DetailRow title="NDC code" value={getValue(openfda.product_ndc)} />
                <DetailRow title="SPL set ID" value={medicine.set_id || "Not available"} />
                <DetailRow title="FDA record ID" value={medicine.id || "Not available"} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  );
};

const DetailRow = ({ title, value }) => (
  <div className="grid gap-2 py-4 md:grid-cols-3">
    <p className="font-semibold">{title}</p>
    <p className="whitespace-pre-line text-sm text-muted-foreground md:col-span-2">{value}</p>
  </div>
);

const SectionHeading = ({ icon: Icon, color, title }) => (
  <div className="flex items-center gap-2">
    <Icon className={`size-5 ${color}`} />
    <CardTitle className="text-xl">{title}</CardTitle>
  </div>
);

const Detail = ({ title, value }) => (
  <section className="space-y-2">
    <h2 className="font-semibold">{title}</h2>
    <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{value}</p>
  </section>
);

export default MedicineDetailsPage;