import { createClient } from "./supabase/client";
import {
  initialPlayers,
  initialRivals,
  initialMatches,
  initialStatsSummary,
} from "./mock-data";
import {
  Player,
  Rival,
  MatchWithRival,
  PlayerStatsSummary,
  MatchDetail,
} from "./supabase/types";

// In-memory runtime cache for seamless local state mutations
let localPlayers: Player[] = [...initialPlayers];
let localRivals: Rival[] = [...initialRivals];
let localMatches: MatchWithRival[] = [...initialMatches];
let localMatchStats: Record<string, any[]> = {
  "match-1": [
    { id: "s1", match_id: "match-1", player_id: "player-1", played: true, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[0] },
    { id: "s2", match_id: "match-1", player_id: "player-3", played: true, goals: 0, assists: 0, yellow_cards: 1, red_cards: 0, clean_sheet: false, player: initialPlayers[2] },
    { id: "s3", match_id: "match-1", player_id: "player-4", played: true, goals: 0, assists: 1, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[3] },
    { id: "s4", match_id: "match-1", player_id: "player-6", played: true, goals: 1, assists: 2, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[5] },
    { id: "s5", match_id: "match-1", player_id: "player-7", played: true, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[6] },
    { id: "s6", match_id: "match-1", player_id: "player-9", played: true, goals: 2, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[8] },
    { id: "s7", match_id: "match-1", player_id: "player-10", played: true, goals: 1, assists: 1, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[9] },
  ],
  "match-2": [
    { id: "s8", match_id: "match-2", player_id: "player-1", played: true, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: true, player: initialPlayers[0] },
    { id: "s9", match_id: "match-2", player_id: "player-3", played: true, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[2] },
    { id: "s10", match_id: "match-2", player_id: "player-5", played: true, goals: 1, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[4] },
    { id: "s11", match_id: "match-2", player_id: "player-6", played: true, goals: 0, assists: 1, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[5] },
    { id: "s12", match_id: "match-2", player_id: "player-8", played: true, goals: 0, assists: 1, yellow_cards: 1, red_cards: 0, clean_sheet: false, player: initialPlayers[7] },
    { id: "s13", match_id: "match-2", player_id: "player-9", played: true, goals: 2, assists: 0, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[8] },
    { id: "s14", match_id: "match-2", player_id: "player-11", played: true, goals: 0, assists: 1, yellow_cards: 0, red_cards: 0, clean_sheet: false, player: initialPlayers[10] },
  ],
};

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-anon-key-here"
  );
}

export async function getRivals(): Promise<Rival[]> {
  if (hasSupabaseConfig()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rivals")
        .select("*")
        .order("name");
      if (!error && data && data.length > 0) return data as Rival[];
    } catch {
      // Fallback
    }
  }
  return localRivals;
}

export async function getPlayers(): Promise<Player[]> {
  if (hasSupabaseConfig()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("dorsal");
      if (!error && data && data.length > 0) return data as Player[];
    } catch {
      // Fallback
    }
  }
  return localPlayers;
}

export async function getPlayerStatsSummary(): Promise<PlayerStatsSummary[]> {
  if (hasSupabaseConfig()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("player_stats_summary")
        .select("*")
        .order("dorsal");
      if (!error && data && data.length > 0)
        return data as PlayerStatsSummary[];
    } catch {
      // Fallback
    }
  }

  return localPlayers.map((player) => {
    let matchesPlayed = 0;
    let goals = 0;
    let assists = 0;
    let yellowCards = 0;
    let redCards = 0;
    let cleanSheets = 0;

    for (const matchId in localMatchStats) {
      const statsList = localMatchStats[matchId] || [];
      const pStat = statsList.find((s) => s.player_id === player.id);
      if (pStat && pStat.played) {
        matchesPlayed += 1;
        goals += pStat.goals || 0;
        assists += pStat.assists || 0;
        yellowCards += pStat.yellow_cards || 0;
        redCards += pStat.red_cards || 0;
        if (pStat.clean_sheet && player.position === "portero") {
          cleanSheets += 1;
        }
      }
    }

    return {
      player_id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      nickname: player.nickname,
      dorsal: player.dorsal,
      position: player.position,
      photo_url: player.photo_url,
      is_active: player.is_active,
      matches_played: matchesPlayed,
      total_goals: goals,
      total_assists: assists,
      total_yellow_cards: yellowCards,
      total_red_cards: redCards,
      total_clean_sheets: cleanSheets,
    };
  });
}

export async function getMatches(): Promise<MatchWithRival[]> {
  if (hasSupabaseConfig()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("matches")
        .select("*, rival:rivals(*)")
        .order("match_date", { ascending: true });
      if (!error && data && data.length > 0) return data as MatchWithRival[];
    } catch {
      // Fallback
    }
  }
  return localMatches.sort(
    (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );
}

export async function getNextMatch(): Promise<MatchWithRival | null> {
  const matches = await getMatches();
  const now = new Date().getTime();
  const upcoming = matches
    .filter(
      (m) => !m.is_finished && new Date(m.match_date).getTime() >= now - 7200000
    )
    .sort(
      (a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
    );
  return upcoming[0] || null;
}

export async function getLastResult(): Promise<MatchWithRival | null> {
  const matches = await getMatches();
  const finished = matches
    .filter((m) => m.is_finished)
    .sort(
      (a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
    );
  return finished[0] || null;
}

export async function getMatchById(id: string): Promise<MatchDetail | null> {
  const matches = await getMatches();
  const match = matches.find((m) => m.id === id);
  if (!match) return null;

  const stats = (localMatchStats[id] || []).map((s) => ({
    ...s,
    player: localPlayers.find((p) => p.id === s.player_id) || {
      id: s.player_id,
      first_name: "Jugador",
      last_name: "",
      nickname: "Desconocido",
      dorsal: 0,
      position: "medio",
      photo_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  }));

  return {
    ...match,
    stats,
  };
}

export async function getStatLeaders() {
  const stats = await getPlayerStatsSummary();

  const topScorer = [...stats].sort((a, b) => b.total_goals - a.total_goals)[0];
  const topAssistant = [...stats].sort(
    (a, b) => b.total_assists - a.total_assists
  )[0];
  const topKeeper = [...stats]
    .filter((p) => p.position === "portero")
    .sort((a, b) => b.total_clean_sheets - a.total_clean_sheets)[0];

  return {
    topScorer: topScorer?.total_goals > 0 ? topScorer : stats[0],
    topAssistant: topAssistant?.total_assists > 0 ? topAssistant : stats[0],
    topKeeper: topKeeper || stats[0],
  };
}

// Data Mutations (Admin Actions)
export async function addRival(name: string, shield_url?: string | null) {
  const newRival: Rival = {
    id: "rival-" + Date.now(),
    name,
    shield_url: shield_url || null,
    created_at: new Date().toISOString(),
  };
  localRivals.push(newRival);
  return newRival;
}

export async function addPlayer(data: Omit<Player, "id" | "created_at">) {
  const newPlayer: Player = {
    ...data,
    id: "player-" + Date.now(),
    created_at: new Date().toISOString(),
  };
  localPlayers.push(newPlayer);
  return newPlayer;
}

export async function updatePlayer(id: string, data: Partial<Player>) {
  localPlayers = localPlayers.map((p) =>
    p.id === id ? { ...p, ...data } : p
  );
  return localPlayers.find((p) => p.id === id);
}

export async function addMatch(data: {
  rival_id: string;
  is_home: boolean;
  match_date: string;
  competition: "liga" | "copa" | "amistoso";
}) {
  const rival = localRivals.find((r) => r.id === data.rival_id);
  const newMatch: MatchWithRival = {
    id: "match-" + Date.now(),
    rival_id: data.rival_id,
    is_home: data.is_home,
    match_date: data.match_date,
    competition: data.competition,
    psg_score: null,
    rival_score: null,
    is_finished: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rival: rival || {
      id: data.rival_id,
      name: "Rival",
      shield_url: null,
      created_at: new Date().toISOString(),
    },
  };
  localMatches.push(newMatch);
  return newMatch;
}

export async function saveMatchSheet(
  matchId: string,
  psgScore: number,
  rivalScore: number,
  playerStats: {
    player_id: string;
    played: boolean;
    goals: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    clean_sheet: boolean;
  }[]
) {
  localMatches = localMatches.map((m) => {
    if (m.id === matchId) {
      return {
        ...m,
        psg_score: psgScore,
        rival_score: rivalScore,
        is_finished: true,
        updated_at: new Date().toISOString(),
      };
    }
    return m;
  });

  localMatchStats[matchId] = playerStats.map((stat, idx) => ({
    id: `stat-${matchId}-${idx}`,
    match_id: matchId,
    ...stat,
    player: localPlayers.find((p) => p.id === stat.player_id),
  }));

  return { success: true };
}

