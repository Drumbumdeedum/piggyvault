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
        <CardTitle className="text-2xl">Login details</CardTitle>
        <CardDescription>Update your login email or password</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default page;
