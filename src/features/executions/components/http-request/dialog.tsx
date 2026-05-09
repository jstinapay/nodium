"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_HTTP_REQUEST_VARIABLE_NAME,
  VARIABLE_NAME_PATTERN,
} from "@/features/executions/lib/node-variable-constants";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(VARIABLE_NAME_PATTERN, {
      message:
        "Use letters, numbers, and underscores, and start with a letter or underscore",
    }),
  endpoint: z.url({ message: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  body: z.string().optional(),
  //.refine(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HttpRequestFormValues) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
  reservedVariableNames?: string[];
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
  reservedVariableNames = [],
}: Props) => {
  const schema = useMemo(
    () =>
      formSchema.refine(
        (values) => !reservedVariableNames.includes(values.variableName),
        {
          path: ["variableName"],
          message: "Variable name is already used by another node",
        },
      ),
    [reservedVariableNames],
  );

  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      variableName:
        defaultValues.variableName || DEFAULT_HTTP_REQUEST_VARIABLE_NAME,
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  useEffect(() => {
    if (open) {
      form.reset({
        variableName:
          defaultValues.variableName || DEFAULT_HTTP_REQUEST_VARIABLE_NAME,
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="httpRequest" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name in templates, for example{" "}
                    {"{{httpRequest.data.id}}"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP method to use for the request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Static URL or use {"{{variables}}"}
                    for simple values or {"{{json variable}}"}
                    to stringify JSON objects/arrays.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          '{\n "userId": "{{httpResponse.data.id}}", \n "name": "{{httpResponse.data.name}}"\n "items}: {{json httpResponse.data.items}}\n}'
                        }
                        {...field}
                        className="min-h-30 font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription>
                      JSON with template variables. Use {"{{variables}}"}
                      for simple values or {"{{json variable}}"}
                      to stringify JSON objects/arrays.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
