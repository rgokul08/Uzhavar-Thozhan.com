"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SOIL_LABELS } from "@/lib/data/crops";

const INDIAN_STATES = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra",
  "Punjab", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal", "Gujarat", "Rajasthan",
  "Madhya Pradesh", "Odisha", "Assam", "Other",
];

const languageOptions = [
  { code: "ta", label: "Tamil" }, { code: "en", label: "English" }, { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" }, { code: "kn", label: "Kannada" }, { code: "ml", label: "Malayalam" },
];

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string(),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  farmerIdCode: z.string().optional(),
  state: z.string().min(1, "Select a state"),
  district: z.string().min(1, "Enter your district"),
  village: z.string().min(1, "Enter your village"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  farmSize: z.string().refine((v) => Number(v) > 0, "Enter your farm size"),
  soilType: z.string().min(1, "Select a soil type"),
  languages: z.array(z.string()).min(1, "Pick at least one language"),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { languages: ["ta"] },
  });
  const selectedLanguages = watch("languages") ?? [];

  function toggleLanguage(code: string) {
    setValue("languages", selectedLanguages.includes(code)
      ? selectedLanguages.filter((l) => l !== code)
      : [...selectedLanguages, code]);
  }

  async function onSubmit(values: FormValues) {
    setServerError("");
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });
    if (error || !data.user) {
      setSubmitting(false);
      setServerError(error?.message ?? "Registration failed. Please try again.");
      return;
    }
    // The on_auth_user_created trigger already inserted a bare farmer_profiles row —
    // fill in the rest of the registration details now that we have the user id.
    await supabase.from("farmer_profiles").update({
      full_name: values.fullName,
      email: values.email,
      phone: `+91${values.mobile}`,
      aadhaar_number: values.aadhaar,
      farmer_id_code: values.farmerIdCode || null,
      state: values.state,
      district: values.district,
      village: values.village,
      pincode: values.pincode,
      farm_size_acres: Number(values.farmSize),
      soil_type: values.soilType,
      languages: values.languages,
    }).eq("id", data.user.id);

    setSubmitting(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-2xl rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-paper/10 dark:bg-night-card/80">
        <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil dark:text-paper">
          <Sprout className="h-6 w-6 text-leaf" /> Create your farmer account
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" error={errors.fullName?.message} {...register("fullName")} />
          <TextField label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <TextField label="Mobile number (10 digits)" error={errors.mobile?.message} {...register("mobile")} />
          <TextField label="Aadhaar number (12 digits)" error={errors.aadhaar?.message} {...register("aadhaar")} />
          <TextField label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <TextField label="Confirm password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <TextField label="Farmer ID (optional)" error={errors.farmerIdCode?.message} {...register("farmerIdCode")} />
          <TextField label="Farm size (acres)" error={errors.farmSize?.message} {...register("farmSize")} />

          <label className="text-sm text-soil-700 dark:text-paper/60">
            State
            <select {...register("state")} className="mt-1 w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm dark:border-paper/20 dark:bg-night-card">
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="mt-1 text-xs text-clay">{errors.state.message}</p>}
          </label>

          <label className="text-sm text-soil-700 dark:text-paper/60">
            Soil type
            <select {...register("soilType")} className="mt-1 w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm dark:border-paper/20 dark:bg-night-card">
              <option value="">Select soil type</option>
              {Object.entries(SOIL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {errors.soilType && <p className="mt-1 text-xs text-clay">{errors.soilType.message}</p>}
          </label>

          <TextField label="District" error={errors.district?.message} {...register("district")} />
          <TextField label="Village" error={errors.village?.message} {...register("village")} />
          <TextField label="Pincode (6 digits)" error={errors.pincode?.message} {...register("pincode")} />

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm text-soil-700 dark:text-paper/60">Languages you speak</p>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((l) => (
                <button type="button" key={l.code} onClick={() => toggleLanguage(l.code)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium ${selectedLanguages.includes(l.code) ? "bg-leaf text-paper" : "border border-soil/20 text-soil-700 dark:border-paper/20 dark:text-paper/60"}`}>
                  {l.label}
                </button>
              ))}
            </div>
            {errors.languages && <p className="mt-1 text-xs text-clay">{errors.languages.message}</p>}
          </div>

          {serverError && <p className="text-sm text-clay sm:col-span-2">{serverError}</p>}

          <button type="submit" disabled={submitting}
            className="rounded-xl bg-leaf py-3.5 text-sm font-semibold text-paper hover:bg-leaf-600 disabled:opacity-60 sm:col-span-2">
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-soil-700 dark:text-paper/60">
          Already registered? <Link href="/auth/login" className="font-semibold text-leaf-600 underline underline-offset-4">Log in</Link>
        </p>
      </motion.div>
    </main>
  );
}

function TextField({ label, error, type = "text", ...rest }: any) {
  return (
    <label className="text-sm text-soil-700 dark:text-paper/60">
      {label}
      <input type={type} {...rest} className="mt-1 w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm dark:border-paper/20 dark:bg-night-card" />
      {error && <p className="mt-1 text-xs text-clay">{error}</p>}
    </label>
  );
}
