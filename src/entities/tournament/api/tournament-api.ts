import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type TournamentFormat = 'single_elim' | 'double_elim' | 'round_robin';
export type TournamentStatus = 'draft' | 'open' | 'live' | 'completed';
export type TournamentLevel = 'beginner' | 'intermediate' | 'pro';

export type TournamentBranchSummary = {
  id: string;
  name: string;
  address?: string | null;
};

export type Tournament = {
  id: string;
  branchId: string;
  name: string;
  format: TournamentFormat;
  status: TournamentStatus;
  capacity: number;
  entryFee: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Present on the public `/tournaments/open` listing (branch is eager-loaded).
  branch?: TournamentBranchSummary | null;
};

export type TournamentRegistration = {
  id: string;
  tournamentId: string;
  teamName: string;
  level: TournamentLevel;
  status?: string;
  createdAt?: string;
  userId?: string;
};

export async function fetchBranchTournaments(
  branchId: string
): Promise<Tournament[]> {
  const res = await axiosInstance.get<ApiResponse<Tournament[]>>(
    `/tournaments/branches/${branchId}`
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load tournaments');
  }
  return res.data.data;
}

export type CreateTournamentInput = {
  branchId: string;
  name: string;
  format: TournamentFormat;
  capacity: number;
  entryFee: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

export async function createTournament({
  branchId,
  ...body
}: CreateTournamentInput): Promise<Tournament> {
  const res = await axiosInstance.post<ApiResponse<Tournament>>(
    `/tournaments/branches/${branchId}`,
    body
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to create tournament');
  }
  return res.data.data;
}

/**
 * Player lobby: list tournaments currently open (or live) for registration.
 * Optionally narrow to a single branch.
 */
export async function fetchOpenTournaments(
  branchId?: string
): Promise<Tournament[]> {
  const res = await axiosInstance.get<ApiResponse<Tournament[]>>(
    '/tournaments/open',
    {
      params: branchId ? { branchId } : undefined,
    }
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load open tournaments');
  }
  return res.data.data;
}

export type RegisterTournamentInput = {
  tournamentId: string;
  teamName: string;
  level: TournamentLevel;
};

/**
 * Player lobby: register a team for an open tournament.
 */
export async function registerForTournament({
  tournamentId,
  teamName,
  level,
}: RegisterTournamentInput): Promise<TournamentRegistration> {
  const res = await axiosInstance.post<ApiResponse<TournamentRegistration>>(
    `/tournaments/${tournamentId}/registrations`,
    { teamName, level }
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to register for tournament');
  }
  return res.data.data;
}

export async function fetchTournamentRegistrations(
  tournamentId: string
): Promise<TournamentRegistration[]> {
  const res = await axiosInstance.get<ApiResponse<TournamentRegistration[]>>(
    `/tournaments/${tournamentId}/registrations`
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load registrations');
  }
  return res.data.data;
}
