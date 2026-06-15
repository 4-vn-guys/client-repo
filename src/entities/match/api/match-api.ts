import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type MatchLevel = 'beginner' | 'intermediate' | 'pro';
export type MatchStatus = 'open' | 'full' | 'cancelled' | 'completed';

export type MatchParticipant = {
  id: string;
  userId: string;
  username: string;
  joinedAt: string | null;
};

/**
 * Shape returned by the backend `toLobbyItem` mapper for every match endpoint
 * (open lobby, my matches, join, leave).
 */
export type Match = {
  id: string;
  branchId: string;
  branchName: string | null;
  courtId: string | null;
  courtName: string | null;
  hostUserId: string;
  hostName: string;
  title: string;
  level: MatchLevel;
  startsAt: string | null;
  endsAt: string | null;
  capacity: number;
  status: MatchStatus;
  note: string | null;
  isTournamentLinked: boolean;
  participantCount: number;
  spotsOpen: number;
  participants: MatchParticipant[];
};

export type MatchListFilters = {
  branchId?: string;
  level?: MatchLevel;
};

/**
 * Player lobby: list open, upcoming matches. Optionally filter by branch/level.
 */
export async function fetchOpenMatches(
  filters: MatchListFilters = {}
): Promise<Match[]> {
  const params: Record<string, string> = {};
  if (filters.branchId) params.branchId = filters.branchId;
  if (filters.level) params.level = filters.level;

  const res = await axiosInstance.get<ApiResponse<Match[]>>('/matches/open', {
    params: Object.keys(params).length ? params : undefined,
  });
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load open matches');
  }
  return res.data.data;
}

/**
 * Player lobby: matches the current user has hosted or joined.
 */
export async function fetchMyMatches(): Promise<Match[]> {
  const res = await axiosInstance.get<ApiResponse<Match[]>>('/matches/me');
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load your matches');
  }
  return res.data.data;
}

/**
 * Player lobby: join an open match.
 */
export async function joinMatch(matchId: string): Promise<Match> {
  const res = await axiosInstance.post<ApiResponse<Match>>(
    `/matches/${matchId}/join`
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to join match');
  }
  return res.data.data;
}

/**
 * Player lobby: leave a match the current user joined (host cannot leave).
 */
export async function leaveMatch(matchId: string): Promise<Match> {
  const res = await axiosInstance.delete<ApiResponse<Match>>(
    `/matches/${matchId}/participants/me`
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to leave match');
  }
  return res.data.data;
}
