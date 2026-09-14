CREATE TABLE `badges` (
	`id` text PRIMARY KEY NOT NULL,
	`badge_key` text NOT NULL,
	`earned_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`is_custom` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gamification_state` (
	`id` text PRIMARY KEY NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`current_streak_days` integer DEFAULT 0 NOT NULL,
	`longest_streak_days` integer DEFAULT 0 NOT NULL,
	`last_activity_date` text,
	`total_saved_minor` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`target_amount_minor` integer NOT NULL,
	`current_amount_minor` integer DEFAULT 0 NOT NULL,
	`currency` text NOT NULL,
	`deadline` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`category_id` text NOT NULL,
	`note` text,
	`created_at` text NOT NULL,
	`friction_level` integer DEFAULT 0 NOT NULL,
	`was_skipped` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
