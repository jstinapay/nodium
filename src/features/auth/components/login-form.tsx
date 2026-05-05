"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardFooter,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { use } from "react";

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email({
            email: values.email,
            password: values.password
        },
        { 
            onSuccess() { 
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        });
    };
    const isPending = form.formState.isSubmitting;

    return (
        <div className = "flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Welcome back 
                    </CardTitle>
                    <CardDescription>
                        Please sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">

                                <div className="grid gap-6">
                                    <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                         <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                type="email" 
                                                placeholder="you@example.com" 
                                                {...field} 
                                            />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                         <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                {...field} 
                                            />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="submit" disabled={isPending}>
                                        Login
                                    </Button>                                    <div className="flex items-center gap-3 py-1">
                                        <Separator className="flex-1 bg-zinc-700" />
                                        <span className="text-xs uppercase tracking-[0.2em]">
                                            OR
                                        </span>
                                        <Separator className="flex-1 bg-zinc-700" />
                                    </div>
                                <div className="flex flex-col gap-4">
                                <Button 
                                variant = "outline"
                                className="w-full"
                                type="button"
                                disabled={isPending}
                                >
                                    <Image
                                        src="/logos/google.svg"
                                        alt="Google Icon"
                                        width={20}
                                        height={20}
                                    />
                                Continue with Google
                                </Button>
                                <Button 
                                variant = "outline"
                                className="w-full"
                                type="button"
                                disabled={isPending}
                                >
                                    <Image
                                        src="/logos/github.svg"
                                        alt="GitHub Icon"
                                        width={20}
                                        height={20}
                                    />
                                    Continue with GitHub
                                </Button>
                                </div> 
                                </div>
                                <div className="text-center text-sm"> 
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="underline underline-offset-4">
                                     Sign up
                                     </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )

}



