"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const getValue = (values) => values?.join("\n") || "Not available";
const getFirstValue = (values) => values?.[0] || "Not available";

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

    const getMedicine = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok || !data.results?.[0]) {
          throw new Error("Medicine not found");
        }

        setMedicine(data.results[0]);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    getMedicine();
  }, []);

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-6 h-40 w-full" />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p>Medicine details could not be loaded.</p>
        <Button className="mt-4" onClick={() => router.back()}>Back to results</Button>
      </main>
    );
  }

  const { openfda = {} } = medicine;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Button variant="outline" onClick={() => router.back()}>Back to results</Button>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">{getFirstValue(openfda.brand_name)}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{getFirstValue(openfda.route)}</Badge>
            <Badge variant="secondary">{getFirstValue(openfda.product_type)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <Detail title="Generic name" value={getValue(openfda.generic_name)} />
          <Detail title="Manufacturer" value={getValue(openfda.manufacturer_name)} />
          <Detail title="Active ingredients" value={getValue(medicine.active_ingredient)} />
          <Detail title="Dosage and administration" value={getValue(medicine.dosage_and_administration)} />
          <Detail title="Uses" value={getValue(medicine.indications_and_usage)} />
          <Detail title="Warnings" value={getValue(medicine.warnings)} />
        </CardContent>
      </Card>
    </main>
  );
};

const Detail = ({ title, value }) => (
  <section className="space-y-2">
    <h2 className="font-semibold">{title}</h2>
    <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
  </section>
);

export default MedicineDetailsPage;