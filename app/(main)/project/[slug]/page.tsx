"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ProjectView } from "@/components/features/projects/ProjectView";
import { useProjectStore } from "@/stores";

export default function ProjectPage() {
  const params = useParams();
  const { projects, setCurrentProject } = useProjectStore();
  const slug = params.slug as string;

  // Find and set the current project based on the URL slug
  useEffect(() => {
    const project = projects.find(p => p.slug === slug);
    if (project) {
      setCurrentProject(project);
    }
  }, [slug, projects, setCurrentProject]);

  return <ProjectView />;
}