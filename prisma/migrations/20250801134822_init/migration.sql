-- CreateEnum
CREATE TYPE "public"."GameMode" AS ENUM ('cards', 'classic');

-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('waiting', 'active', 'finished', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "public"."PlayerRole" AS ENUM ('host', 'player');

-- CreateEnum
CREATE TYPE "public"."DeviceType" AS ENUM ('desktop', 'mobile', 'tablet');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "detective_name" VARCHAR(100) NOT NULL,
    "game_code" VARCHAR(20),
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_stats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "games_won" INTEGER NOT NULL DEFAULT 0,
    "games_lost" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "cards_collected" INTEGER NOT NULL DEFAULT 0,
    "best_time_seconds" INTEGER NOT NULL DEFAULT 0,
    "favorite_mode" "public"."GameMode" NOT NULL DEFAULT 'cards',
    "combo_streak_record" INTEGER NOT NULL DEFAULT 0,
    "evidences_found" INTEGER NOT NULL DEFAULT 0,
    "suspects_interrogated" INTEGER NOT NULL DEFAULT 0,
    "locations_investigated" INTEGER NOT NULL DEFAULT 0,
    "total_playtime_minutes" INTEGER NOT NULL DEFAULT 0,
    "last_game_date" TIMESTAMP(3),
    "achievements_unlocked" INTEGER NOT NULL DEFAULT 0,
    "rank_level" INTEGER NOT NULL DEFAULT 1,
    "rank_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "device_type" "public"."DeviceType",
    "browser" VARCHAR(50),
    "operating_system" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3),
    "logout_time" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."games" (
    "id" SERIAL NOT NULL,
    "game_code" VARCHAR(20) NOT NULL,
    "host_user_id" INTEGER NOT NULL,
    "game_mode" "public"."GameMode" NOT NULL,
    "max_players" INTEGER NOT NULL DEFAULT 6,
    "current_players" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."GameStatus" NOT NULL DEFAULT 'waiting',
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'medium',
    "time_limit_minutes" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "winner_user_id" INTEGER,
    "total_score" INTEGER,
    "game_duration_minutes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "settings_json" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_players" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "detective_name" VARCHAR(100) NOT NULL,
    "role" "public"."PlayerRole" NOT NULL DEFAULT 'player',
    "is_ready" BOOLEAN NOT NULL DEFAULT false,
    "join_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leave_time" TIMESTAMP(3),
    "final_score" INTEGER,
    "cards_played" INTEGER NOT NULL DEFAULT 0,
    "combo_streak" INTEGER NOT NULL DEFAULT 0,
    "evidences_collected" INTEGER NOT NULL DEFAULT 0,
    "time_bonus" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "position_finished" INTEGER,
    "achievements_earned" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_progress" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_id" VARCHAR(255),
    "save_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "game_mode" "public"."GameMode" NOT NULL,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "cards_played" INTEGER NOT NULL DEFAULT 0,
    "combo_streak" INTEGER NOT NULL DEFAULT 0,
    "player_coins" INTEGER NOT NULL DEFAULT 0,
    "evidences_collected" INTEGER NOT NULL DEFAULT 0,
    "suspects_interrogated" INTEGER NOT NULL DEFAULT 0,
    "locations_investigated" INTEGER NOT NULL DEFAULT 0,
    "time_remaining_seconds" INTEGER NOT NULL,
    "progress_data_json" JSONB,
    "is_current_save" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_detective_name_key" ON "public"."users"("detective_name");

-- CreateIndex
CREATE UNIQUE INDEX "game_stats_user_id_key" ON "public"."game_stats"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_token_key" ON "public"."user_sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "games_game_code_key" ON "public"."games"("game_code");

-- CreateIndex
CREATE UNIQUE INDEX "game_players_game_id_user_id_key" ON "public"."game_players"("game_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."game_stats" ADD CONSTRAINT "game_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_host_user_id_fkey" FOREIGN KEY ("host_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_winner_user_id_fkey" FOREIGN KEY ("winner_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_players" ADD CONSTRAINT "game_players_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_players" ADD CONSTRAINT "game_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_progress" ADD CONSTRAINT "game_progress_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_progress" ADD CONSTRAINT "game_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
