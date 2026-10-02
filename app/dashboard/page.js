import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { dashboardPath, isAuthed } from '@/lib/auth';
import SubmitForm, { Field } from '@/components/SubmitForm';
import DashboardList from '@/components/DashboardList';
import { deleteProject, deleteSkill, logout, reorderProjects, reorderSkills, saveProject, saveSkill } from './actions';

export const metadata = { title: 'Dashboard' };

const card = 'rounded-lg border border-[#45475a] bg-[#181825] p-4';
const btn = 'cursor-pointer rounded border border-[#f38ba8] px-3 py-1 text-sm text-[#f38ba8]';

// position first, id as the tie-break: rows that were never dragged all sit at 0 and keep the
// order they had before this field existed.
const byOrder = [{ position: 'asc' }, { id: 'asc' }];

export default async function DashboardPage() {
  if (!(await isAuthed())) redirect(`/${dashboardPath()}/login`);

  const [skills, projects] = await Promise.all([
    prisma.skill.findMany({ orderBy: byOrder }),
    prisma.project.findMany({ orderBy: byOrder }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SubmitForm action={logout} submit="Logout" />
      </div>

      <DashboardList
        title="Skills"
        storageKey="skills"
        ids={skills.map((skill) => skill.id)}
        reorder={reorderSkills}
        footer={
          <div className={`${card} mt-3 flex flex-wrap items-end gap-3`}>
            <SubmitForm action={saveSkill} submit="Add" className="flex flex-1 flex-wrap items-end gap-3">
              <Field name="name" label="Name" placeholder="New skill" className="min-w-40 flex-1" />
            </SubmitForm>
          </div>
        }
      >
        {skills.map((skill) => (
          <div key={skill.id} className={`${card} flex flex-wrap items-end gap-3`}>
            <SubmitForm action={saveSkill} submit="Save" className="flex flex-1 flex-wrap items-end gap-3">
              <input name="id" type="hidden" defaultValue={skill.id} />
              <Field name="name" label="Name" defaultValue={skill.name} className="min-w-40 flex-1" />
            </SubmitForm>
            <SubmitForm action={deleteSkill} submit="Delete" className="flex items-center gap-3">
              <input name="id" type="hidden" defaultValue={skill.id} />
            </SubmitForm>
          </div>
        ))}
      </DashboardList>

      <DashboardList
        title="Projects"
        storageKey="projects"
        ids={projects.map((project) => project.id)}
        reorder={reorderProjects}
        footer={
          <div className={`${card} mt-3`}>
            <SubmitForm action={saveProject} submit="Add" className="space-y-2">
              <div className="flex flex-wrap gap-3">
                <Field name="name" label="Name" placeholder="New project" className="min-w-40 flex-1" />
                <Field name="image" label="Image URL" placeholder="https://..." className="min-w-40 flex-1" />
              </div>
              <Field name="description" label="Description" />
              <div className="flex flex-wrap gap-3">
                <Field name="githubUrl" label="GitHub URL" placeholder="https://github.com/..." className="min-w-40 flex-1" />
                <Field name="technologies" label="Technologies (comma separated)" className="min-w-40 flex-1" />
              </div>
            </SubmitForm>
          </div>
        }
      >
        {projects.map((project) => (
          <div key={project.id} className={card}>
            <SubmitForm action={saveProject} submit="Save" className="space-y-2">
              <input name="id" type="hidden" defaultValue={project.id} />
              <div className="flex flex-wrap gap-3">
                <Field name="name" label="Name" defaultValue={project.name} className="min-w-40 flex-1" />
                <Field name="image" label="Image URL" defaultValue={project.image ?? ''} className="min-w-40 flex-1" />
              </div>
              <Field name="description" label="Description" defaultValue={project.description} />
              <div className="flex flex-wrap gap-3">
                <Field name="githubUrl" label="GitHub URL" defaultValue={project.githubUrl} className="min-w-40 flex-1" />
                <Field
                  name="technologies"
                  label="Technologies (comma separated)"
                  defaultValue={project.technologies.join(', ')}
                  className="min-w-40 flex-1"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="archived" type="checkbox" defaultChecked={project.archived} />
                Archived
              </label>
            </SubmitForm>
            <SubmitForm action={deleteProject} submit="Delete" className="flex items-center gap-2">
              <input name="id" type="hidden" defaultValue={project.id} />
              <button className={`${btn} mt-2`}>Delete</button>
            </SubmitForm>
          </div>
        ))}
      </DashboardList>
    </div>
  );
}
