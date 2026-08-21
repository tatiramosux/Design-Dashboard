import { readCollection, readSettings, supabaseConfigured, writeCollection, writeSettings } from './utils/supabase';

export { supabaseConfigured };

export async function loadWorkspace<TProject, TClient>() {
  const [projects, clients] = await Promise.all([
    readCollection<TProject>('projects'),
    readCollection<TClient>('clients'),
  ]);
  return { projects, clients };
}

export const saveProjects = <T extends { id: number }>(projects: T[]) => writeCollection('projects', projects);
export const saveClients = <T extends { id: number }>(clients: T[]) => writeCollection('clients', clients);
export const loadAccountSettings = <T>() => readSettings<T>();
export const saveAccountSettings = <T>(settings: T) => writeSettings(settings);
