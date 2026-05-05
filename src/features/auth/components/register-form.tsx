"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { use } from "react";
import { auth } from "@/lib/auth";

const registerSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (values: RegisterFormValues) => {
        await authClient.signUp.email({
            name: values.email,
            email: values.email,
            password: values.password,
            callbackURL: `/`,
        },
        {
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        }
    )
    };
    const isPending = form.formState.isSubmitting;

    return (
        <div className = "flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Get Started
                    </CardTitle>
                    <CardDescription>
                        Create your account
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
                                    <FormField 
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                         <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                                        Sign Up
                                    </Button>                                                                        
                                    <div className="flex items-center gap-3 py-1">
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
                                    Already have an account?{" "}
                                    <Link href="/login" className="underline underline-offset-4">
                                     Login
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
