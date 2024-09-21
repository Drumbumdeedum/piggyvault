export function FormError({ response }: { response: FormResponse }) {
  const displayMessage: boolean =
    response &&
    ("success" in response || "error" in response || "message" in response);
  return (
    <>
      {displayMessage && (
        <div className="flex flex-col gap-2 w-full max-w-md text-sm">
          {"success" in response && (
            <div className="text-foreground border-l-2 border-foreground px-4">
              {response.success}
            </div>
          )}
          {"error" in response && (
            <div className="text-destructive border-l-2 border-destructive px-4">
              {response.error}
            </div>
          )}
          {"message" in response && (
            <div className="text-foreground border-l-2 px-4">
              {response.message}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default FormError;
