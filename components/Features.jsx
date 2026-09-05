import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Features = () => {
  return (
    <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-16 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          See the active ingredients listed on the medicine label.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dosage</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Find dosage directions and warnings provided by the official label.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medicine details</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Review product type, route, manufacturer, and other available details.
        </CardContent>
      </Card>
    </section>
  )
}

export default Features
