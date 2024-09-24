import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Personal data</CardTitle>
        <CardDescription>Update personal data</CardDescription>
      </CardHeader>
      <CardContent>CONTENT</CardContent>
    </Card>
  );
};

export default page;
