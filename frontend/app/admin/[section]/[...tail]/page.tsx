"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LegacyNestedAdminPage() {
  const params = useParams<{ section: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/${params.section}`);
  }, [params.section, router]);

  return null;
}
