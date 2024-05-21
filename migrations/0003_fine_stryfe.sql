DROP TABLE "customers";--> statement-breakpoint
DROP TABLE "prices";--> statement-breakpoint
DROP TABLE "products";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_users_id_fk";
