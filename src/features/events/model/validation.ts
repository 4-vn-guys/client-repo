import { z } from 'zod';

/**
 * Mirrors the backend register schema:
 *   teamName: string (2..120), level: beginner | intermediate | pro
 */
export const tournamentRegistrationSchema = z.object({
  teamName: z.string().trim().min(2).max(120),
  level: z.enum(['beginner', 'intermediate', 'pro']),
});

export type TournamentRegistrationValues = z.infer<
  typeof tournamentRegistrationSchema
>;
