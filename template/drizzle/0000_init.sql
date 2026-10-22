CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch('subsec') * 1000) NOT NULL
);
