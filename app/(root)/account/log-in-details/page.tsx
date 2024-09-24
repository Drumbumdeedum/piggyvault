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
        <CardTitle className="text-2xl">Log in details</CardTitle>
        <CardDescription>Update your log in email or password</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default page;
